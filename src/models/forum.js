const db = require('./db');

async function forumList(params) {
  const sql = 'SELECT * FROM forum ORDER BY fi_idx DESC';

  return db.query(sql, params);
}

async function forumCreate(params) {
  const sql =
    'INSERT INTO forum(fi_title, fi_category, fi_content, ui_idx,' +
    'create_datetime, update_datetime)' +
    'VALUES(?, ?, ?, ?, now(), now())';

  return db.query(sql, params);
}

module.exports = {
  forumCreate,
  forumList,
};
