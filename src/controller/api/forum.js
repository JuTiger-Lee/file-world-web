const forumModel = require('../../models/forum');
const MakeResponse = require('../handler/MakeResponse');
const Pagenation = require('../handler/Pagenation');

async function list(req, res, next) {
  try {
    console.log('rrrr', req.query);
    const makeResponse = new MakeResponse();

    const listForum = await forumModel.forumList([]);

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse(listForum.data));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function write(req, res, next) {
  try {
    const makeResponse = new MakeResponse();
    const { fi_title, fi_category, fi_tag, fi_content } = req.body;

    const createForum = await forumModel.forumCreate([
      fi_title,
      fi_category,
      fi_content,
      req.user.idx,
    ]);

    if (createForum.data.affectedRows > 0) {
      makeResponse.init(201, 200, 'success');

      return res.json(makeResponse.makeSuccessResponse([]));
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = {
  list,
  write,
};
