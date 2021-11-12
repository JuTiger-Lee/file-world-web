const mysql = require('mysql');
const { development } = require('../config/db');
const MakeResponse = require('../controller/handler/MakeResponse');

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
  const makeResponse = new MakeResponse();
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

        result = {
          status: 222,
          message: 'success',
          data: queryData,
        };
      } catch (err) {
        await conn.rollback();

        makeResponse.init(500, 603, 'query Error');
        throw makeResponse.makeErrorResponse(err, 'DB Query Error');
      }
    } catch (err) {
      await conn.rollback();

      makeResponse.init(500, 602, 'beginTransaction Error');
      throw makeResponse.makeErrorResponse(err, 'DB beginTransaction Error');
    }
  } catch (err) {
    makeResponse.init(500, 601, 'DB connection Error');
    throw makeResponse.makeErrorResponse(err, 'DB connection Error');
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
