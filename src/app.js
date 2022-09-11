'use strict';
const server = require(`./config/express`);

require(`dotenv`).config();
server.createServer();
var app = require('./config/express');

module.exports = app;

