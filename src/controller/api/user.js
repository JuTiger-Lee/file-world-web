const passport = require('passport');
const jwt = require('jsonwebtoken');
const { AUTH_KEY } = require('../../utils/setting');
const Email = require('../Email');
const { encrypt, randomSuffix } = require('../hash');
const ctx = require('../../context');

// 회원 가입시 이메일 체크
async function emailCheck(req, res, next) {
  const { ui_email } = req.body;

  try {
    // id duplicate check
    await ctx.serviceUser.checkEmail(ui_email);

    ctx.response.init(200, 200, 'success');

    return res.send(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

// 회원가입시 닉네임 체크
async function nicknameCheck(req, res, next) {
  const { ui_nickname } = req.body;

  try {
    // id duplicate check
    await ctx.serviceUser.checkNickname(ui_nickname);

    ctx.response.init(200, 200, 'success');

    return res.send(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

// 사용자 인증 코드 체크 및 이메일 상태 값 변경
async function emailCodeCheck(req, res, next) {
  const { ui_confirm_code } = req.body;

  try {
    await ctx.serviceUser.checkEmailCode(ui_confirm_code);

    ctx.response.init(200, 200, 'success');

    return res.send(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function singUp(req, res, next) {
  const { ui_email, ui_nickname, ui_password } = req.body;
  const beforeProfileImage = '/static/images/profile/blank_profile.png';
  const ui_email_status = 1;

  try {
    // password encrypted
    const hashPassword = encrypt(ui_password);

    // 메일 인증 코드 생성
    const confirmCode = randomSuffix();

    const email = new Email(
      [ui_email],
      'We sincerely welcome you to join the File World.',
      confirmCode,
    );

    await ctx.serviceUser.createUser({
      ui_email,
      ui_nickname,
      hashPassword,
      beforeProfileImage,
      confirmCode,
      ui_email_status,
    });

    // email status change 0: default 1: send 2: join success
    // email send
    await email.joinSend();

    ctx.response.init(201, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

function signIn(req, res, next) {
  passport.authenticate('local', (passportError, user, info) => {
    try {
      if (passportError) {
        ctx.response.init(500, 500, 'login error');
        throw ctx.response.makeErrorResponse(
          passportError,
          'signIn passport Error',
        );
      }

      if (info) {
        // 존재하지 않는 사용자
        if (info.reason === 'non existent user') {
          ctx.response.init(400, 400, info.reason);
          throw ctx.response.makeErrorResponse({}, 'signIn No User Error');
        } else {
          // 비밀번호 불일치
          ctx.response.init(400, 400, info.reason);
          throw ctx.response.makeErrorResponse(
            {},
            'signIn wrong password Error',
          );
        }
      }

      req.login(user, { session: false }, loginError => {
        if (loginError) {
          ctx.response.init(500, 500, 'login error');
          throw ctx.response.makeErrorResponse(loginError, 'signIn loginError');
        }

        // make token
        const token = jwt.sign(
          {
            // user id and idx
            email: user.data[0].ui_email,
            idx: user.data[0].ui_idx,
          },
          // secret key
          AUTH_KEY,
          {
            // 유효시간
            expiresIn: '120m',
          },
        );

        ctx.response.init(200, 200, 'success');

        return res.json(ctx.response.makeSuccessResponse([{ token }]));
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  })(req, res);
}

// 사용자 profile 정보
async function profile(req, res, next) {
  const { currentPage = 1, pageSize = 10 } = req.query;
  const { idx } = req.user;

  try {
    // offset Pagination
    const sql = {
      list:
        'SELECT fi_idx, fi_title, fi_category,' +
        'status, update_datetime FROM forum',
      total: 'SELECT COUNT(fi_idx) as total FROM forum',
      where: 'WHERE ui_idx = ? AND status = 1',
      order: 'ORDER BY fi_idx DESC',
      limit: '',
      params: [idx],
    };

    const userProfile = await ctx.serviceUser.getProfile(
      idx,
      pageSize,
      currentPage,
      sql,
    );

    ctx.response.init(200, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse(userProfile.data));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

// 사용자 프로필 사진 업로드
async function profileUpload(req, res, next) {
  const { originalname, filename } = req.file;
  const { idx } = req.user;

  try {
    await ctx.serviceUser.uploadProfile(
      `/upload/profile/${originalname}`,
      `/upload/profile/${filename}`,
      idx,
    );

    ctx.response.init(200, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

// Use when cookie or session based
function signOut(req, res, next) {}

module.exports = {
  signIn,
  singUp,
  signOut,
  emailCheck,
  nicknameCheck,
  emailCodeCheck,
  profile,
  profileUpload,
};
