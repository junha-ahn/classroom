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
  console.log('hi')
  let error = new Error('배가 고프다');
  next(error);
  // res.render('user', {
  //   title: 'User!',
  //   results,
  // });
});

module.exports = router;