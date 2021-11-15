const passport = require('passport');
const jwt = require('jsonwebtoken');
const { AUTH_KEY } = require('../../utils/setting');
const MakeResponse = require('../handler/MakeResponse');
const userModel = require('../../models/user');
const Email = require('../handler/Email');
const hashHandler = require('../handler/hash');

async function idDataCheck(makeResponse, ui_id) {
  const findUserID = await userModel.userFindID([ui_id]);

  // id duplicate check
  if (findUserID.data.length) {
    makeResponse.init(409, 409, 'id duplicate');
    throw makeResponse.makeErrorResponse({}, 'signUp Error id duplicate');
  }
}

async function nicknameDataCheck(makeResponse, ui_nickname) {
  const findUserNickName = await userModel.userFindNickName([ui_nickname]);

  // nickname duplicate check
  if (findUserNickName.data.length) {
    makeResponse.init(409, 409, 'nickname duplicate');
    throw makeResponse.makeErrorResponse({}, 'user nickname Check Error');
  }
}

async function idCheck(req, res, next) {
  try {
    const makeResponse = new MakeResponse();
    const { ui_id } = req.body;

    // id duplicate check
    await idDataCheck(makeResponse, ui_id);

    makeResponse.init(200, 200, 'success');

    return res.send(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function nicknameCheck(req, res, next) {
  try {
    const makeResponse = new MakeResponse();
    const { ui_nickname } = req.body;

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
    const makeResponse = new MakeResponse();
    const { ui_email, ui_nickname, ui_id, ui_password } = req.body;

    // id duplicate check
    await idDataCheck(makeResponse, ui_id);

    // nickname duplicate check
    await nicknameDataCheck(makeResponse, ui_nickname);

    // password encrypted
    const hashPassword = hashHandler.encrypt(ui_password, 10);

    // email send
    const email = new Email(
      [ui_email],
      'We sincerely welcome you to join the File World.',
    );
    const sendResult = await email.send();

    // email status change 0: default 1: send 2: join success
    if (sendResult.messageId) {
      const createUser = await userModel.userCreate([
        ui_email,
        ui_nickname,
        ui_id,
        hashPassword,
        1,
      ]);

      // affectedRows => add row
      if (createUser.data.affectedRows > 0) {
        makeResponse.init(201, 200, 'success');
        return res.json(makeResponse.makeSuccessResponse([]));
      }
    }
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
            id: user.data[0].ui_id,
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

function signOut(req, res, next) {}

module.exports = {
  signIn,
  singUp,
  signOut,
  idCheck,
  nicknameCheck,
};
