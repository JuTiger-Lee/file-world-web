const db = require('./db');

async function findUserID(params) {
  const sql = 'SELECT * FROM user WHERE ui_id = ?';

  return db.query(sql, params);
}

async function findUserIdx(params) {
  const sql = 'SELECT ui_nickname, ui_profile FROM user WHERE ui_idx = ?';

  return db.query(sql, params);
}

async function findUserNickname(params) {
  const sql = 'SELECT * FROM user WHERE ui_nickname = ?';

  return db.query(sql, params);
}

async function createUser(params) {
  const sql =
    'INSERT INTO user(ui_email, ui_nickname, ui_id, ui_password, ui_profile,' +
    'ui_email_status, create_datetime, update_datetime) ' +
    'VALUES(?, ?, ?, ?, ?, ?, now(), now())';

  return db.query(sql, params);
}

module.exports = {
  findUserID,
  findUserNickname,
  createUser,
  findUserIdx,
};
