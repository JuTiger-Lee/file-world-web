const passport = require('passport');
const { MakeErrorRespone } = require('../utils/makeRes');

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      throw new MakeErrorRespone({}, [], 501, error);
    }

    if (!user) {
      /**
       * jwt expired => info message 유효기간 지날 경우
       * {name: "TokenExpiredError", message: "jwt expired", expiredAt: "2021-11-07T07:03:04.000Z"}
       * invalid signature => 토큰 변조
       * {name: "JsonWebTokenError", message: "invalid signature"}
       */
      throw new MakeErrorRespone({}, [], 401, info.reason || info.message);
    }

    req.user = user;

    next();
  })(req, res, next);
};
