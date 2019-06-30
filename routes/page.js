var express = require('express');
var router = express.Router();

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

const global_data = require('../global/data');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares');

router.get('/', async (req, res, next) => {
  res.render('main', {
    campuses : global_data.campuses,
  });
});

module.exports = router;