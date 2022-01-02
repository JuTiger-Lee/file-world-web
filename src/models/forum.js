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
    'SELECT us.ui_nickname, us.ui_idx, us.ui_profile_hash, fc.fc_comment_idx,' +
    'fc.fc_idx, fc.fc_contents, fc.create_datetime, fc.update_datetime ' +
    'FROM forum_comment AS fc INNER JOIN user AS us ' +
    'ON fc.ui_idx = us.ui_idx WHERE fc.fi_idx = ? ORDER BY fc.fc_idx DESC';

  sql += detailForumSQL;
  sql += commentForumSQL;

  return db.query(sql, params);
}

async function updateView(params) {
  const sql = 'UPDATE forum SET fi_view = fi_view + 1 WHERE fi_idx = 297;';

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

async function createComment(params) {
  const sql =
    'INSERT INTO forum_comment(ui_idx, fi_idx, fc_comment_idx,' +
    'fc_contents, create_datetime, update_datetime) ' +
    'VALUES(?, ?, ?, ?, now(), now());';

  return db.query(sql, params);
}

async function getCategoryCountInfo(params) {
  const sql =
    'SELECT fi_category, COUNT(fi_category) AS count FROM forum GROUP BY fi_category;';

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
  createComment,
  getCategoryCountInfo,
};
