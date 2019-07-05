const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);

const pageRoute = require(path.join(__dirname, '/routes/page'));
const authRoute = require(path.join(__dirname, '/routes/auth'));
const apiRoute = require(path.join(__dirname, '/routes/api'));

const passportConfig = require('./passport');
const foo = require('./global/foo.js');


passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV == 'production') {
  app.use(morgan('combined'));
  app.use(helmet())
  app.use(hpp())
} else {
  app.use(morgan('dev'));
}
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
  },
  store : (process.env.NODE_ENV == 'development') ? 
  undefined : new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    logErrors: true,
  })
}));

app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRoute);
app.use('/auth', authRoute);
app.use('/api', apiRoute);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }
  res.json({
    error_name: error.name,
    error_message: error.message,
  });
});

app.use(function (req, res, next) {
  res.status(404).render('error', foo.getResJson(req.user, {
    error_name : "404 Not Found",
    message : '존재하지 않는 페이지입니다'
  }));
});

module.exports = app;