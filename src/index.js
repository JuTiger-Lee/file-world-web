'use strict';

const express = require('express');
const Server = require('./config/Server');

function start() {
    const server = new Server(express);
    
    server.createServer();
    server.setting();
}

if (require.main === module) start();