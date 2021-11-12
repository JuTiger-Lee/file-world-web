const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const SwaggerAPI = require('../controller/handler/SwaggerAPI');

// user api docs
const { signUp, signIn, idCheck, nicknameCheck } = require('./user');

module.exports = () => {
  const userApiDocs = {
    ...idCheck,
    ...nicknameCheck,
    ...signUp,
    ...signIn,
  };

  const forumApiDcos = {};

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
