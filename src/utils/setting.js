const dotenv = require('dotenv');

const envFound = dotenv.config();

// server port
const port = process.env.PORT || process.env.DEV_PORT;

// Whether or not to use https
const ssl = false;

const ipv4 = '0.0.0.0';

module.exports = {
  envFound,
  port,
  ipv4,
  ssl,
};
