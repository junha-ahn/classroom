const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');

const {
  select_func,
} = require('../query/index');


const info = require('../global/info');
const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn,
  isAdmin,
} = require('../global/middlewares');

router.get('/user/lookup', isAdmin, async (req, res, next) => {

  let {
    page,
    page_length,
    is_admin,
  } = req.query

  page_length = page_length || 10;
  page = page || 1;
  
  let connection;
  try {
    connection = await db_func.getDBConnection();

    let {
      results,
      list_count
    } = await select_func.viewTableUser(connection, {
      page,
      page_length,
      user_type: is_admin ? info.ADMIN_TYPE : null,
      campus_id: req.user.campus_id,
      building_id: req.user.building_id,
    });
    foo.cleaningList(results);

    res.render('admin/user_lookup', foo.getResJson(req.user, {
      results,
      list_count,
      query: req.query,
      params: req.params,
    }))
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});
router.get('/user/single/:user_id', isAdmin, async (req, res, next) => {

  let user_id = req.params.user_id; 
  try {
    connection = await db_func.getDBConnection();

    let {
      results,
      list_count
    } = await select_func.viewTableUser(connection, {
      user_id,
      // 내 건물에 속한 유저만 보이게 하기?...
    });
    
    if (!results[0]) {
      res.status(401).render('error', foo.getResJson(req.user, {
        error_name: '404 NOT FOUND',
        message: '유저를 찾을 수 없습니다',
      }));
    } else {
      foo.cleaningList(results);
      res.render('admin/user', foo.getResJson(req.user, {
        user : results[0],
        query : req.query,
        params : req.params
      }))
    }
  } catch (error){
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.get('/schedule', isAdmin, async (req, res, next) => {
  try {
    connection = await db_func.getDBConnection();

    let {
      results,
      list_count
    } = await select_func.room(connection, {
      building_id: req.user.building_id,
    });
    foo.cleaningList(results);
    res.render('admin/schedule', foo.getResJson(req.user, {
      results,
      query : req.query,
      params : req.params,
      building: info.building_object[req.user.building_id],
    }))

  } catch (error){
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.get('/room/lookup', isAdmin, async (req, res, next) => {
  
  let {
    page,
    page_length,
    floor,
    room_category_id,
  } = req.query

  page_length = page_length || 10;
  page = page || 1;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.room( connection, {
      building_id: req.user.building_id,
      floor,
      room_category_id,
      page,
      page_length
    });
    foo.cleaningList(results);

    res.render('admin/room_lookup', foo.getResJson(req.user, {
      results,
      list_count,
      query: req.query,
      params: req.params,  
    }))
  } catch (error) {
    next(error)
  } finally {
    db_func.release(connection);
  }
});
router.get('/room/single/:room_id', isAdmin, async (req, res, next) => {

  let room_id = req.params.room_id;
  try{
    connection = await db_func.getDBConnection();
    let{
      results,
      list_count
    } = await select_func.room(connection,{
      room_id, 
      building_id: req.user.building_id,
    });
    
    if (!results[0]) {
      res.status(401).render('error', foo.getResJson(req.user, {
        error_name: '404 NOT FOUND',
        message: '강의실을 찾을 수 없습니다',
      }));
    } else {
      foo.cleaningList(results);
      res.render('admin/room', foo.getResJson(req.user, {
        room: results[0],
        list_count,
        query : req.query,
        params : req.params    
      }))
    }
  } catch (error){
    next(error);
  } finally {
    db_func.release(connection);
  }
  
});
router.get('/reservation/lookup', isAdmin, async (req, res, next) => {
  let building_id = req.user.building_id;
  let {
    department_id,
    study_group_id,
    rsv_status,
    is_mine,
    date,
    page,
    page_length,
  } = req.query;
  page_length = page_length || 10;
  department_id = department_id ? department_id : (req.user && department_id != 0) ? req.user.department_id : null;
  rsv_status = rsv_status ? rsv_status : null;
  let connection;
  try {
    let building = info.building_object[building_id];
    if (!building) {
      res.render('error', foo.getResJson(req.user, {
        error_name: "건물을 찾을수 없습니다",
        message: "다시 확인해주세요"
      }));
    } else {
      connection = await db_func.getDBConnection();
      let {
        results,
        list_count,
      } = await select_func.viewTableRoomRsvList(connection, {
        department_id,
        study_group_id,
        rsv_status,
        is_mine,
        user_id: req.user ? req.user.user_id : null,
        date,
        page,
        page_length,
        sort_key: 'start_datetime',
        sort_type: false,
      })
      let study_group_results = (await select_func.viewTableStudyGroup(connection, {
        department_id,
        building_id,
        user_id: (req.user) ? req.user.user_id : null,
      })).results;
      foo.cleaningList(results);
      foo.cleaningList(study_group_results);
      res.render('admin/reservation_lookup', foo.getResJson(req.user, {
        params: req.params,
        query: {
          ...req.query,
          department_id: department_id || 0,
          study_group_id: study_group_id || 0,
          rsv_status : rsv_status || 0,
        },
        department_results: info.department_results,
        rsv_status_results: info.rsv_status_results,
        study_group_results,
        results,
        list_count,
      }));
    }
  } catch (error) {
    next(error)
  } finally {
    db_func.release(connection);
  }
});
router.get('/reservation/single/:room_reservation_id', isAdmin, async (req, res, next) => {
  res.render('admin/reservation', foo.getResJson(req.user, {

  }))
});


module.exports = router;