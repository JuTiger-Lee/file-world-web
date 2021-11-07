const passport = require('passport');
const jwt = require('jsonwebtoken');
const { AUTH_KEY } = require('../../utils/setting');
const { makeRespone, MakeErrorRespone } = require('../../utils/makeRes');
const userModel = require('../../models/user');
const Email = require('../handler/Email');
const hashHandler = require('../handler/hash');

async function singup(req, res, next) {
  const { ui_email, ui_name, ui_id, ui_password } = req.body;

  try {
    const findUser = await userModel.findUser([ui_id]);

    // id duplicate check
    if (findUser.data.length && findUser.status === 222) {
      throw new MakeErrorRespone({}, [], 261, 'id duplicate');
    }

    if (!findUser.length && findUser.status === 222) {
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
        const createUser = await userModel.createUser([
          ui_email,
          ui_name,
          ui_id,
          hashPassword,
          1,
        ]);

        // affectedRows => add row
        if (createUser.status === 222 && createUser.data.affectedRows > 0) {
          return res.json(makeRespone({}, [], 201, 'success.'));
        }
      }
    }
  } catch (err) {
    console.log('signup Error:', err);
    return next(err);
  }
}

function login(req, res, next) {
  passport.authenticate('local', (passportError, user, info) => {
    try {
      if (passportError) {
        throw new MakeErrorRespone({}, [], 261, passportError);
      }

      // 존재 하지 않는 사용자 및 비밀번호 불일치시
      if (info) {
        throw new MakeErrorRespone({}, [], 262, info.reason);
      }

      req.login(user, { session: false }, loginError => {
        if (loginError) {
          throw new MakeErrorRespone(loginError, [], 263, loginError);
        }

        // make token
        const token = jwt.sign(
          {
            // user id
            id: user.data[0].ui_id,
          },
          // secret key
          AUTH_KEY,
          {
            // 유효시간
            expiresIn: '60m',
          },
        );

        return res.json(makeRespone({}, { token }, 200, 'success'));
      });
    } catch (err) {
      console.log('signin Error: ', err);
      return next(err);
    }
  })(req, res);
}

function logout(req, res, next) {}

module.exports = {
  login,
  singup,
  logout,
};
