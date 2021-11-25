const MakeResponse = require('../handler/MakeResponse');
const Pagination = require('../handler/Pagination');
const forumModel = require('../../models/forum');

async function list(req, res, next) {
  try {
    const { currentPage, pageSize = 10, category, titleSearch } = req.query;
    const makeResponse = new MakeResponse();

    // offset Pagination
    const sql = {
      list:
        'SELECT us.status, us.ui_idx, us.ui_nickname, us.ui_profile, us.ui_profile_hash,' +
        'fo.fi_idx, fo.fi_title, fo.fi_category, fo.status, fo.update_datetime ' +
        'FROM forum as fo INNER JOIN user as us ON us.ui_idx = fo.ui_idx',
      total:
        'SELECT COUNT(fo.fi_idx) as total FROM forum as fo' +
        ' INNER JOIN user as us ON us.ui_idx = fo.ui_idx',
      where: 'WHERE us.status = ? AND fo.status = ?',
      order: 'ORDER BY fo.fi_idx DESC',
      limit: '',
      params: [1, 1],
    };

    if (category !== 'ALL' && category) {
      sql.where += ' AND fo.fi_category = ?';
      sql.params.push(category);
    }

    if (titleSearch !== 'ALL' && titleSearch) {
      sql.where += ' AND fo.fi_title LIKE ?';
      sql.params.push(`%${titleSearch}%`);
    }

    const pagination = new Pagination(pageSize, currentPage, sql);
    pagination.init();

    const pagingData = await pagination.getPagingInfo();

    makeResponse.init(200, 200, 'success');

    return res.json(
      makeResponse.makeSuccessResponse([{ pagination: pagingData }]),
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function write(req, res, next) {
  try {
    const { fi_title, fi_category, fi_content } = req.body;
    const makeResponse = new MakeResponse();

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
