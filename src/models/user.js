const db = require('./db');

async function userFindID(params) {
  const sql = 'SELECT * FROM user WHERE ui_id = ?';

  return db.query(sql, params);
}

async function userFindNickName(params) {
  const sql = 'SELECT * FROM user WHERE ui_nickname = ?';

  return db.query(sql, params);
}

async function userCreate(params) {
  const sql =
    'INSERT INTO user(ui_email, ui_name, ui_id, ui_password,' +
    'ui_email_status, create_datetime, update_datetime)' +
    'VALUES(?, ?, ?, ?, ?, now(), now())';

  return db.query(sql, params);
}

module.exports = {
  userFindID,
  userFindNickName,
  userCreate,
};
