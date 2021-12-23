const MakeResponse = require('../handler/MakeResponse');
const Pagination = require('../handler/Pagination');
const forumModel = require('../../models/forum');
const { decodeToken } = require('../handler/hash');

async function list(req, res, next) {
  const { currentPage = 1, pageSize = 10, category = 'ALL', title } = req.query;
  const makeResponse = new MakeResponse();
  const auth = req.headers.authorization;

  let ui_idx = decodeToken(auth);

  if (!ui_idx) ui_idx = 0;
  else ui_idx = ui_idx.idx;

  const sql = {
    list:
      'SELECT us.ui_nickname, us.ui_profile, us.ui_profile_hash,' +
      'fo.fi_idx, fo.fi_title, fo.fi_category, fo.update_datetime, ' +
      '(' +
      'SELECT COUNT(*) FROM post_like AS pl ' +
      'WHERE pl.fi_idx = fo.fi_idx' +
      ') AS like_count,' +
      '(' +
      'SELECT IF(COUNT(*) = 1, "true", "false") FROM post_like AS pl ' +
      'WHERE pl.fi_idx = fo.fi_idx AND pl.ui_idx = ?' +
      ') AS like_status,' +
      '(' +
      'SELECT IF(COUNT(*) >= 1, "true", "false") FROM forum AS fo ' +
      'WHERE us.ui_idx = fo.ui_idx AND fo.ui_idx = ?' +
      ') AS post_status ' +
      'FROM forum AS fo INNER JOIN user AS us ON us.ui_idx = fo.ui_idx ',
    total:
      'SELECT COUNT(fo.fi_idx) AS total FROM forum AS fo ' +
      'INNER JOIN user AS us ON us.ui_idx = fo.ui_idx ',
    where: 'WHERE us.status = 1 AND fo.status = 1',
    order: 'ORDER BY fo.fi_idx DESC',
    limit: '',
    params: [ui_idx, ui_idx],
  };

  if (category !== 'ALL' && category) {
    sql.where += ' AND fo.fi_category = ?';
    sql.params.push(category);
  }

  if (title) {
    sql.where += ' AND fo.fi_title LIKE ?';
    sql.params.push(`%${title}%`);
  }

  try {
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
  const { fi_title, fi_category, fi_content } = req.body;
  const makeResponse = new MakeResponse();

  try {
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

async function update(req, res, next) {
  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function commentWrite(req, res, next) {
  const { ci_contents, fi_ni_idx, ci_type } = req.body;

  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function commentUpdate(req, res, next) {
  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function detail(req, res, next) {
  const { idx } = req.params;
  const makeResponse = new MakeResponse();

  try {
    const detailForum = await forumModel.detailForum([idx]);

    if (!detailForum.data.length || detailForum.data.length > 1) {
      makeResponse.init(500, 500, 'detail Error');
      throw makeResponse.makeErrorResponse({}, 'forum detail Error');
    }

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse(detailForum.data));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function postView(req, res, next) {
  const { fi_ci_idx, li_type } = req.body;

  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function like(req, res, next) {
  const { fi_idx } = req.body;
  const makeResponse = new MakeResponse();

  try {
    const checkLike = await forumModel.checkLike([req.user.idx, fi_idx]);

    if (checkLike.data[0].like_count) {
      makeResponse.init(500, 500, 'likes are already enabled.');
      throw makeResponse.makeErrorResponse({}, 'like check Error');
    }

    const insertLike = await forumModel.createLike([req.user.idx, fi_idx]);

    if (!insertLike.data.affectedRows) {
      makeResponse.init(500, 500, 'like Error');
      throw makeResponse.makeErrorResponse({}, 'like insert Error');
    }

    makeResponse.init(201, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function unLike(req, res, next) {
  const { unLikeIdx } = req.query;
  const makeResponse = new MakeResponse();

  try {
    const deleteLike = await forumModel.deleteLike([req.user.idx, unLikeIdx]);

    if (!deleteLike.data.affectedRows) {
      makeResponse.init(500, 500, 'unlike Error');
      throw makeResponse.makeErrorResponse({}, 'like delete Error');
    }

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = {
  list,
  write,
  update,
  commentWrite,
  commentUpdate,
  detail,
  postView,
  like,
  unLike,
};
