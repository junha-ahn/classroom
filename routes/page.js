var express = require('express');
var router = express.Router();

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

const info = require('../global/info');
const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares');

router.get('/', async (req, res, next) => {
  res.render('main', foo.getResJson(req.user, {
    campuses: info.campuses,
    campus_id : (req.user) ? req.user.campus_id : 0,
  }));
});

router.get('/group', async (req, res, next) => {
  let {
    page,
    page_length,
  } = req.query;
  page_length = 10;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.getStudyGroup(connection, {
      page,
      page_length,
    })
    foo.cleaningList(results);
    res.render('group', foo.getResJson(req.user, {
      results,
      list_count,
    }));
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.get('/reservation/:building_id', async (req, res, next) => {
  let building_id = req.params.building_id;

  let building = info.buildings[building_id];
  
  if (!building[0]) {
    res.render('NotFound', foo.getResJson(req.user, {

    }));
  } else {
    res.render('Reservation', foo.getResJson(req.user, {

    }));
  }
});

router.get('/login', isNotLoggedIn, async (req, res, next) => {
  res.render('login', foo.getResJson(req.user, {

  }));
});

router.get('/join', isNotLoggedIn, async (req, res, next) => {
  res.render('join', foo.getResJson(req.user, {
    campus_results: info.campus_results,
    buildings: info.buildings,
  }));
});

module.exports = router;