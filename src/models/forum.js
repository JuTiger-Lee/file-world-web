const db = require('./db');

async function createForum(params) {
  const sql =
    'INSERT INTO forum(fi_title, fi_category, fi_content, ui_idx,' +
    'create_datetime, update_datetime)' +
    'VALUES(?, ?, ?, ?, now(), now());';

  return db.query(sql, params);
}

async function deleteForum(params) {
  const sql = 'DELETE FROM forum WHERE fi_idx = ?;';

  return db.query(sql, params);
}

async function detailForum(params) {
  let sql = '';

  // multi SQL

  const detailForumSQL =
    'SELECT us.ui_nickname, us.ui_profile_hash, fo.fi_title,' +
    'fo.fi_category, fo.fi_view, fo.fi_content, fo.update_datetime,' +
    '(' +
    'SELECT COUNT(*) FROM forum_like AS fl ' +
    'WHERE fl.fi_idx = ?' +
    ') AS like_count,' +
    '(' +
    'SELECT IF(COUNT(*) = 1, "true", "false") FROM forum_like AS fl ' +
    'WHERE fl.fi_idx = ? AND fl.ui_idx = ?' +
    ') AS like_status,' +
    '(' +
    'SELECT IF(COUNT(*) >= 1, "true", "false") FROM forum AS fo ' +
    'WHERE fo.fi_idx = ? AND fo.ui_idx = ?' +
    ') AS forum_status ' +
    'FROM forum as fo INNER JOIN user as us ON fo.ui_idx = us.ui_idx ' +
    'WHERE fo.fi_idx = ? AND fo.status = 1 AND us.status = 1;';

  const commentForumSQL =
    'SELECT  us.ui_nickname, us.ui_idx, us.ui_profile_hash,' +
    '(' +
    'SELECT us.ui_nickname FROM ' +
    'USER as us WHERE us.ui_idx = fc.fc_target_ui_idx' +
    ') AS ui_target_nickname,' +
    'fc.fc_idx, fc.fc_target_ui_idx, fc.fc_group_idx, fc.fc_contents,' +
    'fc.create_datetime, fc.update_datetime ' +
    'FROM forum_comment AS fc ' +
    'INNER JOIN USER AS us ' +
    'ON fc.ui_idx = us.ui_idx ' +
    'WHERE fc.status = 1 ' +
    'AND us.status = 1 ' +
    'AND fc.fi_idx = ? ' +
    'ORDER BY ' +
    // fc_replay_idx가 null인 컬럼(댓글)은 내림차순 null이 아닌 컬럼(대댓글)은 오름차순
    'CASE WHEN fc.fc_replay_idx IS NULL THEN fc.fc_idx END DESC,' +
    'fc.fc_idx ASC';

  sql += detailForumSQL;
  sql += commentForumSQL;

  return db.query(sql, params);
}

async function updateView(params) {
  const sql = 'UPDATE forum SET fi_view = fi_view + 1 WHERE fi_idx = ?;';

  return db.query(sql, params);
}

async function getCategoryCountInfo(params) {
  const sql =
    'SELECT fi_category, COUNT(fi_category) AS count FROM forum GROUP BY fi_category;';

  return db.query(sql, params);
}

async function getRankForum(params) {
  const sql =
    'SELECT us.ui_idx, us.ui_nickname, us.ui_profile_hash,' +
    'fo.fi_idx, fo.fi_title, fo.fi_category,' +
    '(' +
    'SELECT COUNT(*) FROM forum_like AS fl ' +
    'WHERE fl.fi_idx = fo.fi_idx' +
    ') AS like_count,' +
    '(' +
    'SELECT COUNT(*) FROM forum_comment AS fc ' +
    'WHERE fc.fi_idx = fo.fi_idx ' +
    'AND fc.fc_target_ui_idx IS NULL ' +
    'AND fc.fc_group_idx IS NULL' +
    ') AS comment_count,' +
    'fo.fi_view ' +
    'FROM forum AS fo INNER JOIN USER AS us ' +
    'ON us.ui_idx = fo.ui_idx ' +
    'WHERE us.status = 1 AND ' +
    'fo.status = 1 ' +
    'ORDER BY like_count DESC,' +
    'comment_count DESC,' +
    'fo.fi_view DESC ' +
    'LIMIT 3';

  return db.query(sql, params);
}

async function checkLike(params) {
  const sql =
    'SELECT COUNT(*) as like_count FROM forum_like WHERE ui_idx = ? AND fi_idx = ?;';

  return db.query(sql, params);
}

async function createLike(params) {
  const sql = 'INSERT INTO forum_like(ui_idx, fi_idx) VALUES(?, ?);';

  return db.query(sql, params);
}

async function deleteLike(params) {
  const sql = 'DELETE FROM forum_like WHERE ui_idx = ? AND fi_idx = ?;';

  return db.query(sql, params);
}

/* ================ COMMENT ================ */

async function createComment(params) {
  const sql =
    'INSERT INTO forum_comment(ui_idx, fi_idx, fc_replay_idx, fc_target_ui_idx,' +
    'fc_group_idx, fc_contents, create_datetime, update_datetime) ' +
    'VALUES(?, ?, ?, ?, ?, ?, now(), now());';

  return db.query(sql, params);
}

module.exports = {
  createForum,
  deleteForum,
  detailForum,
  updateView,
  checkLike,
  createLike,
  deleteLike,
  getCategoryCountInfo,
  getRankForum,
  createComment,
};
