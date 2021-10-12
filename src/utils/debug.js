'use strict';

// https://www.npmjs.com/package/debug
const Debug = require('debug');

// express server log
const server = new Debug('app: server');

// express server error
const error = new Debug('error: server');

// application log
const log = new Debug('log: server');

// db query log
const query = new Debug('debug: query');

module.exports = {
    server,
    error,
    log,
    query,
}