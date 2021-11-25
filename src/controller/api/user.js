const passport = require('passport');
const jwt = require('jsonwebtoken');
const { AUTH_KEY } = require('../../utils/setting');
const MakeResponse = require('../handler/MakeResponse');
const Email = require('../handler/Email');
const { encrypt, randomSuffix } = require('../handler/hash');
const userModel = require('../../models/user');
const Pagination = require('../handler/Pagination');

/**
 *
 * @param {Object} makeResponse
 * @param {String} ui_email
 */
async function emailDataCheck(makeResponse, ui_email) {
  const user = await userModel.findUserEmail([ui_email]);

  // id duplicate check
  if (user.data.length) {
    makeResponse.init(409, 409, 'email duplicate');
    throw makeResponse.makeErrorResponse({}, 'Email duplicate');
  }
}

/**
 *
 * @param {Object} makeResponse
 * @param {String} ui_nickname
 */
async function nicknameDataCheck(makeResponse, ui_nickname) {
  const user = await userModel.findUserNickname([ui_nickname]);

  // nickname duplicate check
  if (user.data.length) {
    makeResponse.init(409, 409, 'nickname duplicate');
    throw makeResponse.makeErrorResponse({}, 'Nickname duplicate');
  }
}

async function emailCheck(req, res, next) {
  try {
    const { ui_email } = req.body;
    const makeResponse = new MakeResponse();

    // id duplicate check
    await emailDataCheck(makeResponse, ui_email);

    makeResponse.init(200, 200, 'success');

    return res.send(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function nicknameCheck(req, res, next) {
  try {
    const { ui_nickname } = req.body;
    const makeResponse = new MakeResponse();

    // id duplicate check
    await nicknameDataCheck(makeResponse, ui_nickname);

    makeResponse.init(200, 200, 'success');

    return res.send(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function singUp(req, res, next) {
  try {
    const { ui_email, ui_nickname, ui_password } = req.body;
    const makeResponse = new MakeResponse();
    const beforeProfileImage = '/static/images/profile/blank_profile.png';

    const email = new Email(
      [ui_email],
      'We sincerely welcome you to join the File World.',
    );

    // password encrypted
    const hashPassword = encrypt(ui_password, 10);

    // 메일 인증 코드 생성
    const confirmCode = randomSuffix();

    // id duplicate check
    await emailDataCheck(makeResponse, ui_email);

    // nickname duplicate check
    await nicknameDataCheck(makeResponse, ui_nickname);

    // email send
    await email.send();

    // email status change 0: default 1: send 2: join success
    const newUser = await userModel.createUser([
      ui_email,
      ui_nickname,
      hashPassword,
      beforeProfileImage,
      beforeProfileImage,
      confirmCode,
      1,
    ]);

    // affectedRows => add row
    if (!newUser.data.affectedRows) {
      makeResponse.init(500, 500, 'User SignUp Error');
      throw makeResponse.makeErrorResponse({}, 'signUp user insert Error');
    }

    makeResponse.init(201, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

function signIn(req, res, next) {
  passport.authenticate('local', (passportError, user, info) => {
    try {
      const makeResponse = new MakeResponse();

      if (passportError) {
        makeResponse.init(500, 500, 'login error');
        throw makeResponse.makeErrorResponse(
          passportError,
          'signIn passport Error',
        );
      }

      if (info) {
        // 존재하지 않는 사용자
        if (info.reason === 'non existent user') {
          makeResponse.init(400, 400, info.reason);
          throw makeResponse.makeErrorResponse({}, 'signIn No User Error');
        } else {
          // 비밀번호 불일치
          makeResponse.init(400, 400, info.reason);
          throw makeResponse.makeErrorResponse(
            {},
            'signIn wrong password Error',
          );
        }
      }

      req.login(user, { session: false }, loginError => {
        if (loginError) {
          makeResponse.init(500, 500, 'login error');
          throw makeResponse.makeErrorResponse(loginError, 'signIn loginError');
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
            expiresIn: '60m',
          },
        );

        makeResponse.init(200, 200, 'success');

        return res.json(makeResponse.makeSuccessResponse([{ token }]));
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  })(req, res);
}

async function profile(req, res, next) {
  try {
    const { currentPage, pageSize = 10 } = req.query;
    const { idx } = req.user;
    const makeResponse = new MakeResponse();

    // offset Pagination
    const sql = {
      list: 'SELECT * FROM forum',
      total: 'SELECT COUNT(fi_idx) as total FROM forum',
      where: 'WHERE ui_idx = ? AND status = ?',
      order: 'ORDER BY fi_idx DESC',
      limit: '',
      params: [idx, 1],
    };

    const findUserIdx = await userModel.findUserIdx([idx]);
    const pagination = new Pagination(pageSize, currentPage, sql);
    pagination.init();

    const getPagingData = await pagination.getPagingInfo();
    findUserIdx.data[0].pagination = getPagingData;

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse(findUserIdx.data));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function profileUpload(req, res, next) {
  try {
    const { originalname, filename } = req.file;
    const { idx } = req.user;
    const makeResponse = new MakeResponse();

    const userProfile = await userModel.changeProfile([
      `/upload/profile/${originalname}`,
      `/upload/profile/${filename}`,
      idx,
    ]);

    if (!userProfile.data.affectedRows) {
      makeResponse.init(500, 500, 'profile Upload Error');
      throw makeResponse.makeErrorResponse({}, 'profile Upload Error');
    }

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([]));
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
  profile,
  profileUpload,
};
