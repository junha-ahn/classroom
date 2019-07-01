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
    page_name: 'Main',
    campuses: global_data.campuses,
  });
});

router.get('/reservation/:building_id', async (req, res, next) => {
  res.render('Reservation', {
    page_name: 'reservation',
  });
});

module.exports = router;