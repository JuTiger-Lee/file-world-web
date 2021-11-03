const db = require('./db');

async function findUser(params) {
  const sql = 'SELECT * FROM user where ui_id = ?';

  return db.query(sql, params);
}

async function createUser(params) {
  const sql =
    'INSERT INTO user(ui_email, ui_id, ui_password, create_datetime, update_datetime)' +
    'VALUES(?, ?, ?, now(), now())';

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
