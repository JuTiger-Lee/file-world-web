'use strict';

// server port
const port = process.env.PORT || 8081;

// server ipv4 and ipv6
const ipv4 = '0.0.0.0';

// ssl Whether or not to use
const ssl = false;

module.exports = {
    port,
    ipv4,
    ssl,
}