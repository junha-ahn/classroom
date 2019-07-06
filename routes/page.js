const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');

const  {
  select_func,
  update_func,
  insert_func,
  delete_func,
} = require('../query/index');


const info = require('../global/info');
const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('../global/middlewares');

router.get('/', async (req, res, next) => {
  res.render('main', foo.getResJson(req.user, {
    campuses: info.campuses,
    campus_id : req.user ? req.user.campus_id : 0,
  }));
});

router.get('/group/lookup', async (req, res, next) => {
  let {
    page,
    page_length,
    department_id,
    building_id,
    is_mine,
    is_join,
  } = req.query;
  page_length = page_length || 10;
  department_id = department_id ? department_id  : (req.user) ? req.user.department_id : null;
  building_id = building_id ? building_id : (req.user) ? req.user.building_id : null;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    
    let {
      results,
      list_count,
    } = await select_func.studyGroup(connection, {
      page,
      page_length,
      department_id,
      building_id,
      is_mine,
      is_join,
      user_id : (req.user) ? req.user.user_id : null,
    });
    foo.cleaningList(results);
    let building_results = req.user ? info.buildings[req.user.campus_id] : info.building_results;

    res.render('groups', foo.getResJson(req.user, {
      results,
      list_count,
      query: {
        ...req.query,
        department_id: department_id || 0,
        building_id: building_id || 0,
      },
      department_results: info.department_results,
      building_results,
    }));
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.get('/group/single/:study_group_id', async (req, res, next) => {
  let study_group_id = req.params.study_group_id || null;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    
    let groupObject = await select_func.viewTableStudyGroup(connection, {
      study_group_id,
      user_id : (req.user) ? req.user.user_id : null,
    });
    foo.cleaningList(groupObject.results);
    let {
      results,
      list_count,
    } = await select_func.viewTableStudyGroupPerson(connection, {
      study_group_id,
    });
    foo.cleaningList(results, req.user, true);
    res.render('group', foo.getResJson(req.user, {
      group: groupObject.results[0],
      results,
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
    department_results: info.department_results,
    campus_results: info.campus_results,
    buildings: info.buildings,
  }));
});

module.exports = router;