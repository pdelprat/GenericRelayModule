'use strict';
const express = require('express');
const { connect } = require('./startup/db');
const cookieParser = require('cookie-parser');
const morganBody = require('morgan-body');
const { json, urlencoded } = require('body-parser');
const healthRouter = require('./modules/health');
const tracerRouter = require('./modules/tracer');

var app = express();

morganBody(app);
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/tracer', tracerRouter);

async function start() {
  await connect();
}

start();

module.exports = app;
