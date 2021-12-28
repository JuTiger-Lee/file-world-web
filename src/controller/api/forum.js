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
      'fo.fi_idx, fo.fi_title, fo.fi_category, fi_view, fo.update_datetime,' +
      '(' +
      'SELECT COUNT(*) FROM forum_like AS fl ' +
      'WHERE fl.fi_idx = fo.fi_idx' +
      ') AS like_count,' +
      '(' +
      'SELECT IF(COUNT(*) = 1, "true", "false") FROM forum_like AS fl ' +
      'WHERE fl.fi_idx = fo.fi_idx AND fl.ui_idx = ?' +
      ') AS like_status,' +
      '(' +
      'SELECT COUNT(*) FROM forum_comment AS fc ' +
      'WHERE fc.fi_idx = fo.fi_idx' +
      ') AS comment_count,' +
      '(' +
      'SELECT IF(COUNT(*) >= 1, "true", "false") FROM forum AS fo ' +
      'WHERE us.ui_idx = fo.ui_idx AND fo.ui_idx = ?' +
      ') AS forum_status ' +
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

async function detail(req, res, next) {
  const { idx } = req.params;
  const makeResponse = new MakeResponse();
  const auth = req.headers.authorization;

  let ui_idx = decodeToken(auth);

  if (!ui_idx) ui_idx = 0;
  else ui_idx = ui_idx.idx;

  try {
    const detailForum = await forumModel.detailForum([
      idx,
      idx,
      ui_idx,
      idx,
      ui_idx,
      idx,
      idx,
    ]);

    if (!detailForum.data[0].length || detailForum.data[0].length > 1) {
      makeResponse.init(500, 500, 'detail Error');
      throw makeResponse.makeErrorResponse({}, 'forum detail Error');
    }

    const [forum, comment] = detailForum.data;
    const [detailPost] = forum;
    detailPost.comments = comment;

    makeResponse.init(200, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([detailPost]));
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

async function deleteForum(req, res, next) {}

async function update(req, res, next) {
  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function writeComment(req, res, next) {
  const { fi_idx, fc_comment_idx, fc_contents } = req.body;
  const makeResponse = new MakeResponse();

  try {
    const saveComment = await forumModel.createComment([
      req.user.idx,
      fi_idx,
      fc_comment_idx,
      fc_contents,
    ]);

    if (!saveComment.data.affectedRows) {
      makeResponse.init(500, 500, 'comment write Error');
      throw makeResponse.makeErrorResponse({}, 'comment insert Error');
    }

    makeResponse.init(201, 200, 'success');

    return res.json(makeResponse.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function deleteComment() {}

async function updateComment(req, res, next) {
  const makeResponse = new MakeResponse();

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
      makeResponse.init(500, 500, 'like are already enabled.');
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
  const { idx } = req.params;
  const makeResponse = new MakeResponse();

  try {
    const deleteLike = await forumModel.deleteLike([req.user.idx, idx]);

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
  detail,
  write,
  deleteForum,
  update,
  writeComment,
  updateComment,
  like,
  unLike,
};
