const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSOWRD,
    port: process.env.DB_PORT,
  },
  production: {},
};
