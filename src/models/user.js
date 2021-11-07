const db = require('./db');

async function findUser(params) {
  const sql = 'SELECT * FROM user WHERE ui_id = ?';

  return db.query(sql, params);
}

async function createUser(params) {
  const sql =
    'INSERT INTO user(ui_email, ui_name, ui_id, ui_password, ui_email_status, create_datetime, update_datetime)' +
    'VALUES(?, ?, ?, ?, ?, now(), now())';

  return db.query(sql, params);
}

async function updateUser() {}

async function deleteUser() {}

module.exports = {
  findUser,
  updateUser,
  createUser,
  deleteUser,
};
