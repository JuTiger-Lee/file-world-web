const db = require('./db');

async function findUserEmail(params) {
  const sql = 'SELECT * FROM user WHERE ui_email = ?';

  return db.query(sql, params);
}

async function findUserIdx(params) {
  const sql =
    'SELECT ui_nickname, ui_profile, ui_profile_hash FROM user WHERE ui_idx = ?';

  return db.query(sql, params);
}

async function findUserNickname(params) {
  const sql = 'SELECT * FROM user WHERE ui_nickname = ?';

  return db.query(sql, params);
}

async function createUser(params) {
  const sql =
    'INSERT INTO user(ui_email, ui_nickname, ui_password, ui_profile,' +
    'ui_profile_hash, ui_confirm_code, ui_email_status, create_datetime, update_datetime) ' +
    'VALUES(?, ?, ?, ?, ?, ?, ?, now(), now())';

  return db.query(sql, params);
}

async function changeProfile(params) {
  const sql =
    'UPDATE user SET ui_profile = ?, ui_profile_hash = ? WHERE ui_idx = ?';

  return db.query(sql, params);
}

module.exports = {
  findUserEmail,
  findUserNickname,
  createUser,
  findUserIdx,
  changeProfile,
};
