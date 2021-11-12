const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dateStrings: ['DATE', 'DATETIME'],
    timezone: '+09:00',
    multipleStatements: true,
  },
  production: {
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
