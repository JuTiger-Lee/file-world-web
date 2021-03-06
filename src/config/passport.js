const passport = require('passport');
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');

const { AUTH_KEY } = require('../utils/setting');
const userModel = require('../models/user');
const { compare } = require('../controller/handler/hash');

const passportOption = {
  usernameField: 'ui_email',
  passwordField: 'ui_password',
};

const jwtOption = {
  // bear token 체계 요청시 앞에 bear를 넣어야함
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
  // 복호화할시 필요한 secretKey
  secretOrKey: AUTH_KEY,
  // token 만료 확인
  ignoreExpiration: false,
  passReqToCallback: false,
};

/**
 *
 * error가 있을 시 : done(err, false)
 * error는 없으나 user가 없을 때 : done(null, false)
 * error도 없고 user를 찾았을 때 : done(null, user);
 * @param {String} email
 * @param {String} password
 * @param {Function} done
 * @returns
 */
async function passportVerify(email, password, done) {
  try {
    const user = await userModel.findCertUserEmail([email]);

    // user find
    if (!user.data.length) {
      return done(null, false, { reason: 'non existent user' });
    }

    // password compare
    const compareResult = compare(password, user.data[0].ui_password);

    // password inconsistency
    if (!compareResult) {
      return done(null, false, { reason: 'wrong password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

/**
 *
 * @param {Object} payload
 * @param {Function} done
 * @returns
 */
async function jwtVerify(payload, done) {
  try {
    /**
     * payload
     * 
     * {
          "id": "jeffrey", => 사용지 id
          "idx": "111" => 사용자 idx
          "iat": 1636213873, => 토큰 생성시간
          "exp": 1636213933 => 토큰 만료시간
        }
     */
    const user = await userModel.findCertUserEmail([payload.email]);

    if (!user.data.length) {
      return done(null, false, { reason: 'Unauthorized Error' });
    }

    done(null, user);
  } catch (err) {
    return done(err);
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(passportOption, passportVerify));
  passport.use('jwt', new JWTStrategy(jwtOption, jwtVerify));
};
