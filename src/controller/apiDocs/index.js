const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const SwaggerAPI = require('../handler/SwaggerAPI');

// user api docs
const { signUp, signIn, idCheck, nicknameCheck } = require('./user');

// forum api docs
const { listForum } = require('./forum');

module.exports = () => {
  const userApiDocs = {
    ...idCheck,
    ...nicknameCheck,
    ...signUp,
    ...signIn,
  };

  const forumApiDcos = {
    ...listForum,
  };

  const apiDcos = {
    ...userApiDocs,
    ...forumApiDcos,
  };

  const swaggerAPI = new SwaggerAPI();

  swaggerAPI.init();
  swaggerAPI.addAPI(apiDcos);

  const { apiOption, setUpOption } = swaggerAPI.getOption();

  const specs = swaggerJsDoc(apiOption);

  return {
    swaggerUI,
    specs,
    setUpOption,
  };
};
