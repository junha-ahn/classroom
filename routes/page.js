const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');

const info = require('../global/info');
const foo = require('../global/foo');

const {
  select_func,
  update_func,
} = require('../query/index');

const {
  isLoggedIn,
  isNotLoggedIn,
  getRerservationLookup,
  getRerservationSingle,
} = require('../global/middlewares');

router.get('/login', isNotLoggedIn, async (req, res, next) => {
  res.render('user/login', foo.getResJson(req.user, {

  }));
});
router.get('/join', isNotLoggedIn, async (req, res, next) => {
  res.render('user/join', foo.getResJson(req.user, {
    department_results: info.department_results,
    campus_results: info.campus_results,
    buildings: info.buildings,
  }));
});

router.get('/', async (req, res, next) => {
  let message = req.cookies.message;
  res.clearCookie('message');
  res.render('user/main', foo.getResJson(req.user, {
    campuses: info.campuses,
    campus_id: req.user ? req.user.campus_id : 0,
    message,
  }));
});

router.get('/reservation', async (req, res, next) => {
  if (req.user && req.user.building_id) {
    res.redirect('/reservation/intro/'+ req.user.building_id);
  } else {
    res.cookie('message', '비회원은 메인 페이지를 통해 예약 가능합니다.', {
      maxAge: 5 * 1000,
    });
    res.redirect('/');
  }
});

router.get('/reservation/intro/:building_id', async (req, res, next) => {
  try {
    let building_id = req.params.building_id;
    let building = info.building_object[building_id];
    if (!building) {
      res.render('error', foo.getResJson(req.user, {
        error_name: "건물을 찾을수 없습니다",
        message: "다시 확인해주세요"
      }));
    } else {
      res.render('user/reservation_intro', foo.getResJson(req.user, {
        query: req.query,
        params: req.params,
        department_id : req.user ? req.user.department_id || 0 : 0,
      }));
    }
  } catch (error) {
    next(error)
  } 
});
router.get('/reservation/:building_id', async (req, res, next) => {
  try {
    let {
      method
    } = req.query;
    let building_id = req.params.building_id;
    let building = info.building_object[building_id];
    if (method == undefined || (method != 'R' && method != 'DT')) {
      res.render('error', foo.getResJson(req.user, {
        error_name: "페이지를 찾을수 없습니다",
        message: "다시 확인해주세요"
      }));
    } else if (!building) {
      res.render('error', foo.getResJson(req.user, {
        error_name: "건물을 찾을수 없습니다",
        message: "다시 확인해주세요"
      }));
    } else {
      res.render('user/reservation', foo.getResJson(req.user, {
        query: req.query,
        params: req.params,
        method,
      }));
    }
  } catch (error) {
    next(error)
  }
});

router.get('/reservation/lookup/:building_id', getRerservationLookup(false));
router.get('/reservation/single/:room_rsv_id', getRerservationSingle(false));


router.get('/study_group/lookup', async (req, res, next) => {
  let {
    page,
    page_length,
    department_id,
    building_id,
    is_mine,
    is_join,
  } = req.query;
  page_length = page_length || 10;

  let connection;
  try {
    connection = await db_func.getDBConnection();

    let {
      results,
      list_count,
    } = await select_func.vStudyGroup(connection, {
      page,
      page_length,
      department_id,
      building_id,
      is_mine,
      is_join,
      user_id: (req.user) ? req.user.user_id : null,
    });
    foo.cleaningList(results);
    let building_results = req.user ? info.buildings[req.user.campus_id] : info.building_results;
    res.render('user/study_group_lookup', foo.getResJson(req.user, {
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
router.get('/study_group/single/:study_group_id', async (req, res, next) => {
  let study_group_id = req.params.study_group_id || null;

  let connection;
  try {
    connection = await db_func.getDBConnection();

    let groupObject = await select_func.vStudyGroup(connection, {
      study_group_id,
      user_id: (req.user) ? req.user.user_id : null,
    });
    if (!groupObject.results[0]) {
      res.status(401).render('error', foo.getResJson(req.user, {
        error_name: '404 NOT FOUND',
        message: '그룹을 찾을 수 없습니다',
      }));
    } else {
      foo.cleaningList(groupObject.results);
      let building_results = req.user ? info.buildings[req.user.campus_id] : info.building_results;
      let {
        results,
        list_count,
      } = await select_func.vStudyGroupPerson(connection, {
        study_group_id,
      });
      foo.cleaningList(results, req.user, true);
      res.render('user/study_group', foo.getResJson(req.user, {
        group: groupObject.results[0],
        results,
        department_results: info.department_results,
        building_results,
      }));
    }
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});
router.get('/study_group/write', isLoggedIn, async (req, res, next) => {
  res.render('user/study_group_write', foo.getResJson(req.user, {
    department_results: info.department_results,
    building_results: req.user ? info.buildings[req.user.campus_id] : info.building_results,
    department_id: req.user ? req.user.department_id || 0: 0,
    building_id: req.user ? req.user.building_id || 0 : 0,
  }));
});


router.get('/mypage/dashboard', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    results,
    list_count,
  } = await select_func.vNotificationRsv(conn, { 
    receiver_id: req.user.user_id,
    sort_key: 'date_last_updated',
    sort_type: false,
  });
  foo.cleaningList(results);
  console.log(results)
  res.render('user/mypage_dashboard', foo.getResJson(req.user, {
    query:req.query,
    params:req.params,
    results,
    list_count,
  }))
}));
router.get('/mypage/myaccount', isLoggedIn, async (req, res, next) => {
  res.render('user/myaccount', foo.getResJson(req.user, {

  }))
});


router.get('/notification/read/:notification_id', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let notification_id = req.params.notification_id;
  let {
    results,
    list_count,
  } = await select_func.notification(conn, { 
    notification_id,
    receiver_id: req.user.user_id,
  });
  if (!results[0]) {
    res.status(401).render('error', foo.getResJson(req.user, {
      error_name: '404 NOT FOUND',
      message: '알림을 찾을 수 없습니다',
    }));
  } else {
    await update_func.notificationRead(conn, {
      notification_id,
    })
    res.redirect('/reservation/single/' + results[0].room_rsv_id);
  }
}));

module.exports = router;