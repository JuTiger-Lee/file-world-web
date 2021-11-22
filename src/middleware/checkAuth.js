const passport = require('passport');
const jwt = require('jsonwebtoken');
const MakeResponse = require('../controller/handler/MakeResponse');

module.exports = (req, res, next) => {
  const makeResponse = new MakeResponse();

  const decodeToken = beareToken => {
    const token = beareToken.split(' ')[1];

    return jwt.decode(token);
  };

  passport.authenticate('jwt', { session: false }, (error, user, info) => {
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
        makeResponse.init(401, 401, '유효하지 않은 토큰');
      }

      throw makeResponse.makeErrorResponse({}, 'passport User not found Error');
    }

    req.user = decodeToken(req.headers.authorization);

    next();
  })(req, res, next);
};
