const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

let pageRoute = require(path.join(__dirname, '/routes/page'));
let authRoute = require(path.join(__dirname, '/routes/auth'));
let apiRoute = require(path.join(__dirname, '/routes/api'));
const passportConfig = require('./passport');
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan(process.env.NODE_ENV == 'PRODUCTION' ? 'common' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser(process.env.COOKE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRoute);
app.use('/auth', authRoute);
app.use('/api', apiRoute);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    console.error(error);
  }
  res.json({
    error_name: error.name,
    error_message: error.message,
  });
});

app.use(function (req, res, next) {
  res.status(404).render('NotFound',{});
});

module.exports = app;