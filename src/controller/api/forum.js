const forumModel = require('../../models/forum');
const MakeResponse = require('../handler/MakeResponse');
const Pagination = require('../handler/Pagination');

async function list(req, res, next) {
  try {
    const makeResponse = new MakeResponse();
    const { pageSize, currentPage } = req.body;

    // offset Pagination
    const sql = {
      list: `SELECT * FROM forum`,
      total: 'SELECT COUNT(fi_idx) as total FROM forum',
      where: '',
      whereList: [],
      order: `ORDER BY fi_idx DESC`,
      limit: '',
      params: [],
    };

    const pagination = new Pagination();
    await pagination.init(pageSize, currentPage, sql);

    const getPagingData = pagination.getPageInfo();

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse(getPagingData));
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
