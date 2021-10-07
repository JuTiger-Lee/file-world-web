'use strict';

const mysql = require('mysql');
const { serverDB } = require('../config/db');

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

    const queryProcessing = () => {
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
                const queryData = await queryProcessing(conn, sql, params);
                await conn.commit();
                result = settings.createResponse(222, 'success', {}, queryData);
            } catch (err) {
                await conn.rollback();
                result = settings.createResponse(666, 'query Error', err, {});
            }
        } catch (err) {
            await conn.rollback();
            result = settings.createResponse(666, 'beginTransaction Error', err, {});
        }
    } catch (err) {
        result = settings.createResponse(500, 'DB Error', err, {});
    }

    closeConnDB(conn);

    return result;
}

module.exports = {
    query,
}