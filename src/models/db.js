'use strict';

const mysql = require('mysql');
const { serverDB } = require('../config/db');
const debug = require('../utils/debug');

function connDB() {
    const conn = mysql.createConnection(serverDB);
    conn.connect();

    return conn;    
}

/**
 * 
 * @param {Object} conn 
 */
function closeConnDB(conn) {
    conn.end();
    conn = null;
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
                else res(rows)
            });
        });
    }

    try {
        conn = connDB();
        try {
            await conn.beginTransaction();
            try {
                const queryData = await getQueryData(conn, sql, params);
                await conn.commit();
                
                result = settings.createResponse(222, 'success', {}, queryData);
            } catch (err) {
                await conn.rollback();

                debug.error(`status: 666 message: query Error Error: ${err}`);
                result = settings.createResponse(666, 'query Error', err, {});
            }
        } catch (err) {
            await conn.rollback();

            debug.error(`status: 666 message: query beginTransaction Error: ${err}`);
            result = settings.createResponse(666, 'beginTransaction Error', err, {});
        }
    } catch (err) {
        debug.error(`status: 666 message: query DB Error: ${err}`);
        result = settings.createResponse(500, 'DB Error', err, {});
    }

    closeConnDB(conn);

    return result;
}

// TODO...
function poolQuery() {}

module.exports = {
    query,
    poolQuery,
}