const passport = require('passport');
const MakeResponse = require('../controller/handler/MakeResponse');

module.exports = (req, res, next) => {
  const makeResponse = new MakeResponse();

  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      makeResponse.init(
        401,
        401,
        info.reason || info.message || 'Unauthorized Error',
      );
      throw makeResponse.MakeErrorRespone(error, 'passport authenticate Error');
    }

    if (!user) {
      /**
       * jwt expired => info message 유효기간 지날 경우
       * {name: "TokenExpiredError", message: "jwt expired", expiredAt: "2021-11-07T07:03:04.000Z"}
       * invalid signature => 토큰 변조
       * {name: "JsonWebTokenError", message: "invalid signature"}
       */
      makeResponse.init(
        401,
        401,
        info.reason || info.message || 'Unauthorized Error',
      );
      throw makeResponse.MakeErrorRespone({}, 'passport User not found Error');
    }

    next();
  })(req, res, next);
};
