const mysql = require('mysql');
const { development } = require('../config/db');
const debug = require('../utils/debug');
const { MakeErrorRespone, makeRespone } = require('../utils/makeRes');

function connDB() {
  const conn = mysql.createConnection(development);
  conn.connect();

  return conn;
}

/**
 *
 * @param {Object} conn
 */
function closeConnDB(conn) {
  conn.end();
}

/**
 *
 * @param {String} sql
 * @param {Array} params
 * @returns {Object}
 */
async function query(sql, params) {
  let result = {};
  let conn = {};

  const getQueryData = () => {
    return new Promise((res, rej) => {
      conn.query(sql, params, (err, rows) => {
        if (err) rej(err);
        else res(rows);
      });
    });
  };

  try {
    conn = connDB();
    try {
      await conn.beginTransaction();
      try {
        const queryData = await getQueryData(conn, sql, params);
        await conn.commit();

        result = makeRespone({}, queryData, 222, 'success');
      } catch (err) {
        await conn.rollback();

        debug.error(`status: 666 message: query Error Error: ${err}`);

        throw new MakeErrorRespone(err, [], 603, 'query Error');
      }
    } catch (err) {
      await conn.rollback();

      debug.error(`status: 666 message: query beginTransaction Error: ${err}`);

      throw new MakeErrorRespone(err, [], 602, 'beginTransaction Error');
    }
  } catch (err) {
    debug.error(`status: 666 message: query DB Error: ${err}`);

    throw new MakeErrorRespone(err, [], 601, 'DB Error');
  }

  closeConnDB(conn);

  return result;
}

// TODO...
function poolQuery() {}

module.exports = {
  query,
  poolQuery,
};
