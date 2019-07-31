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
  getRerservationLookup,
  getRerservationSingle,
  getUserSingle,
} = require('../global/middlewares');

router.get('/', isAdmin, async (req, res, next) => {
  res.redirect('/admin/reservation/lookup?page=1');
});

router.get('/user/lookup', isAdmin, async (req, res, next) => {
  let {
    page,
    page_length,
    is_admin,
    department_id,
  } = req.query

  page_length = page_length || 10;
  page = page || 1;

  let connection;
  try {
    connection = await db_func.getDBConnection();

    let {
      results,
      list_count
    } = await select_func.vUser(connection, {
      page,
      page_length,
      user_type: is_admin ? info.ADMIN_TYPE : null,
      campus_id: req.user.campus_id,
      building_id: req.user.building_id,
      department_id,
    });
    foo.cleaningList(results);

    res.render('admin/user_lookup', foo.getResJson(req.user, {
      results,
      list_count,
      query: {
        ...req.query,
        department_id: department_id || 0,
        is_admin: is_admin || 0,
      },
      params: req.params,
      department_results: info.department_results
    }))
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});
router.get('/user/single/:user_id', isAdmin, getUserSingle(true));

router.get('/holiday', isAdmin, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    results,
    list_count
  } = await select_func.room(conn, {
    building_id: req.user.building_id,
  });
  foo.cleaningList(results);
  res.render('admin/holiday', foo.getResJson(req.user, {
    results,
    query: req.query,
    params: req.params,
    building: info.building_object[req.user.building_id],
  }))
}));
router.get('/schedule', isAdmin, async (req, res, next) => {
  let connection;
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
      query: req.query,
      params: req.params,
      building: info.building_object[req.user.building_id],
    }))

  } catch (error) {
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
    } = await select_func.room(connection, {
      building_id: req.user.building_id,
      floor,
      room_category_id,
      page,
      page_length,
    });
    foo.cleaningList(results);
    res.render('admin/room_lookup', foo.getResJson(req.user, {
      results,
      list_count,
      room_category_results: info.room_category_results,
      query: {
        ...req.query,
        floor: req.query.floor || 0,
        room_category_id: req.query.room_category_id || 0,
      },
      params: req.params,
      building_id: req.user.building_id,
    }))
  } catch (error) {
    next(error)
  } finally {
    db_func.release(connection);
  }
});
router.get('/room/single/:room_id', isAdmin, async (req, res, next) => {
  let room_id = req.params.room_id;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count
    } = await select_func.room(connection, {
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
      res.render('admin/room_single', foo.getResJson(req.user, {
        room: results[0],
        list_count,
        query: req.query,
        params: req.params,
        room_category_results: info.room_category_results,
        permission_results: info.permission_results,
      }))
    }
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});
router.get('/room/write', isAdmin, async (req, res, next) => {
  res.render('admin/room_write', foo.getResJson(req.user, {
    room_category_results: info.room_category_results,
    permission_results: info.permission_results,
  }))
});
router.get('/reservation/lookup', isAdmin, getRerservationLookup(true));
router.get('/reservation/single/:room_rsv_id', isAdmin, getRerservationSingle(true));
router.get('/reservation/write', isAdmin, async (req, res, next) => {
  res.render('admin/reservation_write', foo.getResJson(req.user, {
    building_id: req.user.building_id,
    rsv_status_results: info.rsv_status_results,
    room_rsv_category_results: info.room_rsv_category_results,
    department_results: info.department_results,
  }))
});

module.exports = router;