const db = require('./db');

async function createForum(params) {
  const sql =
    'INSERT INTO forum(fi_title, fi_category, fi_content, ui_idx,' +
    'create_datetime, update_datetime)' +
    'VALUES(?, ?, ?, ?, now(), now())';

  return db.query(sql, params);
}

async function detailForum(params) {
  const sql =
    'SELECT us.ui_nickname, us.ui_profile_hash, fo.fi_title, fo.fi_category,' +
    'fo.fi_content, fo.update_datetime FROM ' +
    'forum as fo INNER JOIN user as us ON fo.ui_idx = us.ui_idx ' +
    'WHERE fo.fi_idx = ? AND fo.status = 1 AND us.status = 1';

  return db.query(sql, params);
}

async function checkLike(params) {
  const sql =
    'SELECT COUNT(*) as like_count FROM post_like WHERE ui_idx = ? AND fi_idx = ?';

  return db.query(sql, params);
}

async function createLike(params) {
  const sql = 'INSERT INTO post_like(ui_idx, fi_idx) VALUES(?, ?)';

  return db.query(sql, params);
}

async function deleteLike(params) {
  const sql = 'DELETE FROM post_like WHERE ui_idx = ? AND fi_idx = ?';

  return db.query(sql, params);
}

module.exports = {
  createForum,
  detailForum,
  checkLike,
  createLike,
  deleteLike,
};
