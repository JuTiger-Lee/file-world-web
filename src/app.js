const express = require('express');
const Server = require('./config/Server');

function start() {
  const server = new Server(express);

  server.setting();
  server.routing();
  server.createServer();
}

if (require.main === module) start();
