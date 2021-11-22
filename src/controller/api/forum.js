const MakeResponse = require('../handler/MakeResponse');
const Pagination = require('../handler/Pagination');
const forumModel = require('../../models/forum');

async function list(req, res, next) {
  try {
    const { currentPage, pageSize, category, title_search } = req.query;
    const makeResponse = new MakeResponse();

    // offset Pagination
    const sql = {
      list:
        'SELECT us.ui_idx, us.ui_nickname, us.ui_profile,' +
        'fo.update_datetime, fo.fi_title, fo.fi_category, fo.fi_idx' +
        ' FROM forum as fo INNER JOIN user as us ON us.ui_idx = fo.ui_idx',
      total: 'SELECT COUNT(fi_idx) as total FROM forum',
      where: '',
      whereList: [],
      order: 'ORDER BY fi_idx DESC',
      limit: '',
      params: [],
    };

    const pagination = new Pagination(pageSize, currentPage, sql);
    pagination.init();

    const getPagingData = await pagination.getPagingInfo();

    makeResponse.init(200, 200, 'success');

    return res.json(
      makeResponse.makeSuccessResponse([{ pagination: getPagingData }]),
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function write(req, res, next) {
  try {
    const makeResponse = new MakeResponse();
    const { fi_title, fi_category, fi_content } = req.body;

    const newForum = await forumModel.createForum([
      fi_title,
      fi_category,
      fi_content,
      req.user.idx,
    ]);

    if (!newForum.data.affectedRows) {
      makeResponse.init(500, 500, 'write Error');
      throw makeResponse.makeErrorResponse({}, 'forum post insert Error');
    }

    makeResponse.init(201, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = {
  list,
  write,
};
