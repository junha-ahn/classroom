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

router.get('/group', async (req, res, next) => {
  let {
    page_num,
    page_length,
  } = req.query;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.getStudyGroup(connection, {
      page_num,
      page_length,
    })
    res.render('group', {
      results,
      list_count,
    });
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.get('/reservation/:building_id', async (req, res, next) => {
  let building_id = req.params.building_id;

  let building = global_data.buildings[building_id];
  
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
    campus_results: global_data.campus_results,
    buildings: global_data.buildings,
  });
});

module.exports = router;