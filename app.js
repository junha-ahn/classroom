const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

let indexRoute = require(path.join(__dirname, '/routes/index.js'));
let apiRoute = require(path.join(__dirname, '/routes/api.js'));

app.use(cors());

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));

app.use('/', indexRoute);
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
  res.status(404).json({
    message: '해당 경로가 없습니다',
    params: req.params,
    query: req.query,
    body: req.body,
  });
});

module.exports = app;