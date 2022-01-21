const forumModel = require('../../models/forum');
const { decodeToken } = require('../hash');
const ctx = require('../../context');

async function list(req, res, next) {
  const { currentPage = 1, pageSize = 10, category = 'ALL', title } = req.query;
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
      'WHERE fc.fi_idx = fo.fi_idx ' +
      'AND fc.fc_target_ui_idx IS NULL ' +
      'AND fc.fc_group_idx IS NULL' +
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
    const pageingList = await ctx.serviceForum.getPageingList(
      pageSize,
      currentPage,
      sql,
    );

    return res.json(
      ctx.response.makeSuccessResponse([{ pagination: pageingList }]),
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function detail(req, res, next) {
  const { idx } = req.params;
  const auth = req.headers.authorization;

  let ui_idx = decodeToken(auth);

  if (!ui_idx) ui_idx = 0;
  else ui_idx = ui_idx.idx;

  try {
    const detailForum = await ctx.serviceForum.getDetail(idx, ui_idx);

    ctx.response.init(200, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([detailForum]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function write(req, res, next) {
  const { fi_title, fi_category, fi_content } = req.body;

  try {
    await ctx.serviceForum.createPost(
      fi_title,
      fi_category,
      fi_content,
      req.user.idx,
    );

    ctx.response.init(201, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function update(req, res, next) {
  const { fi_title, fi_category, fi_content } = req.body;

  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function remove(req, res, next) {
  const { fi_idx } = req.params;

  try {
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function rankForum(req, res, next) {
  try {
    const rankForumList = await ctx.serviceForum.getRankList();

    ctx.response.init(200, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse(rankForumList.data));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function countCategory(req, res, next) {
  const initCategoryList = [
    {
      fi_category: 'data-export',
      count: 0,
    },
    {
      fi_category: 'image-resize',
      count: 0,
    },
    {
      fi_category: 'file-controller',
      count: 0,
    },
    {
      fi_category: 'etc',
      count: 0,
    },
  ];

  try {
    const countCategoryList = await ctx.serviceForum.getCountCategoryList([]);

    for (let i = 0; i < countCategoryList.data.length; i += 1) {
      const categoryInfoList = Object.values(countCategoryList.data[i]);

      for (let j = 0; j < initCategoryList.length; j += 1) {
        const [fi_category, count] = categoryInfoList;

        if (initCategoryList[j].fi_category === fi_category) {
          initCategoryList[j].count = count;
        }
      }
    }

    ctx.response.init(200, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse(initCategoryList));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function forumLike(req, res, next) {
  const { fi_idx } = req.body;

  try {
    await ctx.serviceForum.createLike(req.user.idx, fi_idx);

    ctx.response.init(201, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function forumUnLike(req, res, next) {
  const { idx } = req.params;

  try {
    await ctx.serviceForum.deliteLike(req.user.idx, idx);

    ctx.response.init(200, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

/* ================ COMMENT ================ */

async function writeComment(req, res, next) {
  const { fi_idx, fc_replay_idx, fc_target_ui_idx, fc_group_idx, fc_contents } =
    req.body;

  try {
    const ui_idx = req.user.idx;

    await ctx.serviceComment.createComment({
      ui_idx,
      fi_idx,
      fc_replay_idx,
      fc_target_ui_idx,
      fc_group_idx,
      fc_contents,
    });

    ctx.response.init(201, 200, 'success');

    return res.json(ctx.response.makeSuccessResponse([]));
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = {
  list,
  detail,
  write,
  remove,
  update,
  countCategory,
  rankForum,
  forumLike,
  forumUnLike,
  writeComment,
};
