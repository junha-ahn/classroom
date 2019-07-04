const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

const info = require('../global/info');
const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares');

router.get('/', async (req, res, next) => {
  let campus_id = (req.user) ? info.building_object[req.user.building_id].campus_id : 0;
  res.render('main', foo.getResJson(req.user, {
    campuses: info.campuses,
    campus_id,
  }));
});

router.get('/group', async (req, res, next) => {
  req.query.page_length = 10;
  let {
    page,
    page_length,
  } = req.query;

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
      query: req.query,
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
    res.render('error', foo.getResJson(req.user, {

    }));
  } else {
    res.render('reservation', foo.getResJson(req.user, {
      query: req.query,
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