const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  local: {
    user: process.env.LOCAL_DB_USER,
    host: process.env.LOCAL_DB_HOST,
    database: process.env.LOCAL_DB_DATABASE,
    password: process.env.LOCAL_DB_PASSWORD,
    port: process.env.LOCAL_DB_PORT,
    dateStrings: ['DATE', 'DATETIME'],
    timezone: '+09:00',
    // multi query on
    multipleStatements: true,
  },
  dev: {
    user: process.env.DEV_DB_USER,
    host: process.env.DEV_DB_HOST,
    database: process.env.DEV_DB_DATABASE,
    password: process.env.DEV_DB_PASSWORD,
    port: process.env.DEV_DB_PORT,
    dateStrings: ['DATE', 'DATETIME'],
    timezone: '+09:00',
    multipleStatements: true,
  },
  prod: {
    user: '',
    host: '',
    database: '',
    password: '',
    port: '',
    dateStrings: ['DATE', 'DATETIME'],
    timezone: '+09:00',
    multipleStatements: true,
  },
};
