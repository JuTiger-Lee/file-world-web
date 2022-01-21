const userModel = require('../../../models/admin/user');
const MakeResponse = require('../../MakeResponse');

async function list(req, res, next) {
  try {
    const makeRespone = new MakeResponse();
    const listUser = await userModel.listUser([]);

    makeRespone.init(200, 200, 'success');

    return res.send(makeRespone.makeSuccessResponse(listUser.data));
  } catch (err) {
    console.log('admin API: user list Error:', err);
    return next(err);
  }
}

module.exports = {
  list,
};
