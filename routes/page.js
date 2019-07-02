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
    campuses: global_data.campus_results,
  });
});

router.get('/reservation/:building_id', async (req, res, next) => {
  let building_id = req.params.building_id;

  let building = global_data.building_results.filter(building => building.building_id == building_id);
  
  if (!building[0]) {
    res.render('NotFound', {});
  } else {
    res.render('Reservation', {});
  }
});

router.get('/login', isNotLoggedIn, async (req, res, next) => {
  res.render('login', {});
});

router.get('/join', isNotLoggedIn, async (req, res, next) => {
  res.render('join', {
    campuses: global_data.campus_results,
  });
});
module.exports = router;