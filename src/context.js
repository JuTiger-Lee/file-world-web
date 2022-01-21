const MakeResponse = require('./controller/MakeResponse');
const ServiceUser = require('./services/user');
const ServiceForum = require('./services/forum');
const ServiceComment = require('./services/comment');

function context() {
  const makeResponse = new MakeResponse();
  const serviceUser = new ServiceUser(makeResponse);
  const serviceForum = new ServiceForum(makeResponse);
  const serviceComment = new ServiceComment(makeResponse);

  return {
    response: makeResponse,
    serviceUser,
    serviceForum,
    serviceComment,
  };
}

module.exports = context();
