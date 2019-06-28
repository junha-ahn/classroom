var express = require('express');
var router = express.Router();

let results = require('../data.js');

router.get('/', function (req, res, next) {
  res.render('index', {
    title : 'Index!',
    msg: 'ejs',
  });
});

router.get('/user', function (req, res, next) {
  res.render('user', {
    title: 'User!',
    results,
  });
});

module.exports = router;