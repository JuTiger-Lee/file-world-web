const passport = require('passport');
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');

const { AUTH_KEY } = require('../utils/setting');
const userModel = require('../models/user');
const hashHandler = require('../controller/handler/hash');

const passportOption = { usernameField: 'ui_id', passwordField: 'ui_password' };
const jwtOption = {
  // bear token 체계 요청시 앞에 bear를 넣어야함
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
  // 복호화할시 필요한 secretKey
  secretOrKey: AUTH_KEY,
  // token 만료 확인
  ignoreExpiration: false,
};

async function passportVerify(id, password, done) {
  try {
    const user = await userModel.findUser([id]);

    // user find
    if (!user.data.length) {
      return done(null, false, { reason: '존재하지 않는 사용자' });
    }

    // password compare
    const compareResult = hashHandler.compare(
      password,
      user.data[0].ui_password,
    );

    // password inconsistency
    if (!compareResult) {
      return done(null, false, { reason: '비밀번호가 틀렸어요.' });
    }

    return done(null, user);
  } catch (err) {
    console.log('passport Error: ', err);
    return done(err);
  }
}

async function jwtVerify(payload, done) {
  try {
    /**
     * payload
     * 
     * {
          "id": "jeffrey", => 사용지 id
          "iat": 1636213873, => 토큰 생성시간
          "exp": 1636213933 => 토큰 만료시간
        }
     */
    const user = await userModel.findUser([payload.id]);

    if (!user.data.length) {
      return done(null, false, { reason: '유효하지 않은 토큰' });
    }

    done(null, user);
  } catch (err) {
    console.log('token check Error: ', err);
    return done(err);
  }
}

module.exports = () => {
  passport.use(new LocalStrategy(passportOption, passportVerify));
  passport.use(new JWTStrategy(jwtOption, jwtVerify));
};
