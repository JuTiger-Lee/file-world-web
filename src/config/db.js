'use strict';

const dotenv = require('dotenv');
dotenv.config();

const serverDB = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSOWRD,
    port: process.env.DB_PORT,
};

const localDB = {};

module.exports = { 
    serverDB,
    localDB,
}