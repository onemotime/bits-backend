require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const habitRouter = require('./routes/habit')

const app = express();

require("./config/database");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/habit', habitRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log(err.message);
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message ? err.message : 'Internal server error'
  });
});

module.exports = app;
