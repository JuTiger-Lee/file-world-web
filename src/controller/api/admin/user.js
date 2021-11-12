const userModel = require('../../../models/admin/user');
const MakeResponse = require('../../handler/MakeResponse');

async function list(req, res, next) {
  try {
    const makeRespone = new MakeResponse();
    const listUser = await userModel.listUser([]);

    if (listUser.status === 222) {
      makeRespone.init(200, 200, 'success');
      makeRespone.makeSuccessResponse(listUser);
    }
  } catch (err) {
    console.log('admin API: user list Error:', err);
    return next(err);
  }
}

module.exports = {
  list,
};
