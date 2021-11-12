const db = require('../db');

async function listUser(params) {
  const sql = 'SELECT * FROM user';

  return db.query(sql, params);
}

module.exports = {
  listUser,
};
