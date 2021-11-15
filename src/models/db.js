const mysql = require('mysql');
const { local, dev, prod } = require('../config/db');
const MakeResponse = require('../controller/handler/MakeResponse');

// let connDBType = '';

// if (process.env.NODE_ENV === 'prod') {
//   connDBType = prod;
// } else if (process.env.NODE_ENV === 'dev') {
//   connDBType = dev;
// } else {
//   connDBType = local;
// }

function connDB() {
  const conn = mysql.createConnection(dev);
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
  const conn = connDB();

  let result = {};

  const getQueryData = () => {
    return new Promise((res, rej) => {
      conn.query(sql, params, (err, rows) => {
        if (err) rej(err);
        else res(rows);
      });
    });
  };

  try {
    await conn.beginTransaction();
    const queryData = await getQueryData(conn, sql, params);
    await conn.commit();

    result = {
      // expandability...
      data: queryData,
    };
  } catch (err) {
    await conn.rollback();

    makeResponse.init(500, 666, 'query Error');
    throw makeResponse.makeErrorResponse(err, 'DB Query Error');
  } finally {
    closeConnDB(conn);
  }

  return result;
}

// TODO...
function poolQuery() {}

module.exports = {
  query,
  poolQuery,
};
