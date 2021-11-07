const dotenv = require('dotenv');

const envFound = dotenv.config();

const AUTH_KEY = process.env.SECRET_KEY;

// server port
const port = process.env.PORT || process.env.DEV_PORT;

// mail send user info
const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD;

// Whether or not to use https
const ssl = false;

const ipv4 = '0.0.0.0';

module.exports = {
  AUTH_KEY,
  envFound,
  port,
  ipv4,
  ssl,
  mailUser,
  mailPassword,
};
