const passport = require('passport');
const MakeResponse = require('../controller/handler/MakeResponse');
const { decodeToken } = require('../controller/handler/hash');

module.exports = (req, res, next) => {
  const makeResponse = new MakeResponse();

  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    try {
      if (error) {
        makeResponse.init(500, 500, 'Unauthorized Error');
        throw makeResponse.makeErrorResponse(
          error,
          'passport authenticate Error',
        );
      }

      if (!user) {
        /**
         * jwt expired => info message 유효기간 지날 경우
         * {name: "TokenExpiredError", message: "jwt expired", expiredAt: "2021-11-07T07:03:04.000Z"}
         * invalid signature => 토큰 변조
         * {name: "JsonWebTokenError", message: "invalid signature"}
         */
        if (info.name === 'TokenExpiredError') {
          makeResponse.init(419, 419, '토큰 만료');
        } else {
          makeResponse.init(401, 401, '인증된 사용자가 아님');
        }

        throw makeResponse.makeErrorResponse(
          {},
          'passport User not found Error',
        );
      }

      req.user = decodeToken(req.headers.authorization);

      return next();
    } catch (err) {
      console.error(err);
      return next(err);
    }
  })(req, res, next);
};
