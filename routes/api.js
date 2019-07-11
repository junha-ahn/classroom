const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');
const constant = require('../global/constant');
const info = require('../global/info');

const {
  select_func,
  update_func,
  insert_func,
  delete_func,
} = require('../query/index');

const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn,
  isAdmin,
  checkReqInfo,
} = require('../global/middlewares');

router.get('/study_group', async (req, res, next) => {
  const {
    page,
    page_length,
    department_id,
    building_id,
  } = req.query;

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
    })

    foo.cleaningList(results);

    res.status(200, foo.getResJson(req.user, {
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

router.post('/study_group', isLoggedIn, checkReqInfo, async (req, res, next) => {
  let {
    department_id,
    building_id,
    name,
    description,
  } = req.body;

  if (name == undefined || department_id == undefined || building_id == undefined) {
    res.status(401).json({
      message: '필수값을 입력해주세요'
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();

      let insert_result = await insert_func.studyGroup(connection, {
        user_id: req.user.user_id,
        department_id,
        building_id,
        name,
        description,
      })
      foo.setRes(res, insert_result, {
        message: '성공했습니다'
      })
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});
router.put('/study_group/:study_group_id', isLoggedIn, async (req, res, next) => {
  let study_group_id = req.params.study_group_id;
  let {
    name,
    description,
  } = req.body;

  if (name == undefined) {
    res.status(401).json({
      message: '필수값을 입력해주세요'
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();

      let update_result = await update_func.studyGroup(connection, {
        study_group_id,
        user_id: req.user.user_id,
        name,
        description,
      })
      foo.setRes(res, update_result, {
        message: '성공했습니다'
      })
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});

router.post('/study_group/join/:study_group_id', isLoggedIn, async (req, res, next) => {
  let study_group_id = req.params.study_group_id;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
    } = await select_func.studyGroup(connection, {
      study_group_id,
      user_id: req.user.user_id,
    })
    if (!results[0]) {
      res.status(401).json({
        message: '그룹을 다시 선택해주세요'
      })
    } else if (results[0].is_join) {
      res.status(401).json({
        message: '이미 가입한 그룹입니다'
      })
    } else {
      let insert_result = await insert_func.studyGroupUser(connection, {
        study_group_id,
        user_id: req.user.user_id,
      })
      foo.setRes(res, insert_result, {
        message: '성공했습니다'
      })
    }
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});
router.delete('/study_group/join/:study_group_id', isLoggedIn, async (req, res, next) => {
  let study_group_id = req.params.study_group_id;

  let connection;
  try {
    connection = await db_func.getDBConnection();

    let delete_result = await delete_func.studyGroupUser(connection, {
      study_group_id,
      user_id: req.user.user_id,
    })
    foo.setRes(res, delete_result, {
      message: '성공했습니다'
    })
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.put('/person/:person_id', isLoggedIn, checkReqInfo, async (req, res, next) => {
  let person_id = req.params.person_id;
  let {
    campus_id,
    building_id,
    is_student,
    name,
    phone,
    student_number,
  } = req.body;
  is_student = is_student ? 1 : 0;
  if (campus_id == undefined || building_id == undefined || is_student == undefined || name == undefined) {
    res.status(401).json({
      message: '필수값을 입력해주세요'
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();
      let {
        results,
      } = await select_func.studyGroup(connection, {
        person_id,
        user_id: req.user.user_id,
      })
      if (!results[0]) {
        res.status(401).json({
          message: '다시 선택해주세요'
        })
      } else {
        let update_result = await update_func.person(connection, {
          person_id,
          campus_id,
          building_id,
          is_student,
          name,
          phone,
          student_number,
        })
        foo.setRes(res, update_result, {
          message: '성공했습니다'
        })
      }
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});

router.get('/room', async (req, res, next) => {
  const {
    building_id,
    sort_by_floor
  } = req.query;
  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.room(connection, {
      building_id,
      sort_key: 'room_number',
    });
    foo.cleaningList(results, req.user);
    res.status(200).json({
      results: sort_by_floor ? roomSortByFloor(results) : results,
      list_count,
    })
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.post('/room', isAdmin, checkReqInfo, async (req, res, next) => {
  const {
    building_id,
    room_category_id,
    auth_rsv_create,
    auth_rsv_cancel,
    name,
    room_number,
    floor,
    seat_count,
    description,
    is_require_rsv_accept,
    is_require_cancel_accept,
    rsv_apply_min_day,
    rsv_cancel_min_day,
  } = req.body;

  if (building_id == undefined || room_category_id == undefined || auth_rsv_create == undefined ||
    auth_rsv_cancel == undefined || name == undefined || room_number == undefined ||
    floor == undefined || is_require_rsv_accept == undefined || is_require_cancel_accept == undefined) {
    res.status(401).json({
      message: '필수값을 입력해주세요'
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();

      let can_manage = await checkAdminManager(connection, {
        user_id: req.user.user_id,
        TYPE: 'room'
      });
      if (!can_manage) {
        res.status(403).json({
          message: '관리 권한이 없습니다'
        })
      } else {
        let insert_result = await insert_func.room(connection, {
          building_id,
          room_category_id,
          auth_rsv_create,
          auth_rsv_cancel,
          name,
          room_number,
          floor,
          seat_count,
          description,
          is_require_rsv_accept,
          is_require_cancel_accept,
          rsv_apply_min_day,
          rsv_cancel_min_day,
        })
        foo.setRes(res, insert_result, {
          message: '성공했습니다'
        })
      }
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});
router.put('/room/:room_id', isAdmin, checkReqInfo, async (req, res, next) => {
  let room_id = req.params.room_id;

  const {
    room_category_id,
    auth_rsv_create,
    auth_rsv_cancel,
    name,
    room_number,
    floor,
    seat_count,
    description,
    is_require_rsv_accept,
    is_require_cancel_accept,
    rsv_apply_min_day,
    rsv_cancel_min_day,
  } = req.body;

  if (room_category_id == undefined || auth_rsv_create == undefined ||
    auth_rsv_cancel == undefined || name == undefined || room_number == undefined ||
    floor == undefined || is_require_rsv_accept == undefined || is_require_cancel_accept == undefined) {
    res.status(401).json({
      message: '필수값을 입력해주세요'
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();

      let can_manage = await checkAdminManager(connection, {
        user_id: req.user.user_id,
        TYPE: 'room'
      });
      if (!can_manage) {
        res.status(403).json({
          message: '관리 권한이 없습니다'
        })
      } else {
        let update_result = await update_func.room(connection, {
          room_id,
          room_category_id,
          auth_rsv_create,
          auth_rsv_cancel,
          name,
          room_number,
          floor,
          seat_count,
          description,
          is_require_rsv_accept,
          is_require_cancel_accept,
          rsv_apply_min_day,
          rsv_cancel_min_day,
        })
        foo.setRes(res, update_result, {
          message: '성공했습니다'
        })
      }
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});

router.get('/holiday', async (req, res, next) => {
  let {
    building_id,
    room_id,
    year,
    month,
    need_dates,
  } = req.query;

  if (month && !year) {
    res.status(401).json({
      message: "년월을 함께 입력해주세요"
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();
      let {
        results,
        list_count,
      } = await select_func.viewTableRoomHoliday(connection, {
        room_id,
        building_id,
        year,
        month,
        sort_key: 'start_date',
      });
      let dates = need_dates ? getDates(results) : []
      res.status(200).json({
        results,
        dates,
        list_count,
      })
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});
router.get('/available_time', async (req, res, next) => {
  let {
    building_id,
    room_id,
    day_of_the_week,
  } = req.query;

  if (building_id == undefined && day_of_the_week == undefined) {
    res.status(401).json({
      message: "필수 항목을 입력해주세요"
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();
      let {
        results,
        list_count,
      } = await select_func.available_time(connection, {
        building_id,
        room_id,
        day_of_the_week,
        sort_key: 'start_time',
      });
      res.status(200).json({
        results,
        list_count,
      })
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});

function roomSortByFloor(room_results) {
  let rooms = {};
  for (let i in room_results) {
    if (!rooms[room_results[i].floor]) {
      rooms[room_results[i].floor] = []
    }
    rooms[room_results[i].floor].push(room_results[i]);
  }
  return rooms;
}

function checkAdminManager(connection, object) {
  return new Promise(async (resolve, reject) => {
    let {
      user_id,
      TYPE,
    } = object;

    let {
      results
    } = await select_func.viewTableAdmin(connection, {
      user_id,
    })
    if (!results[0]) {
      let error = new Error('회원을 찾을 수 없습니다')
      reject(error);
    } else {
      if (results[0][`can_manage_${TYPE}`]) {
        resolve(true)
      } else {
        resolve(false)
      }
    }
  })
}

function getDates(holiday_results) {
  let dates = [];
  for (let i in holiday_results) {
    console.log(holiday_results[i].start_date, holiday_results[i].end_date, dates);
  }
  return dates;
}

function getDateRange(startDate, endDate, listDate) {
  var dateMove = new Date(startDate);
  var strDate = startDate;
  if (startDate == endDate) {
    var strDate = dateMove.toISOString().slice(0, 10);
    listDate.push(strDate);
  } else {
    console.log('==============')
    while (strDate <= endDate) {
      var strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate);
      console.log(strDate , ' ~ ', endDate)
      dateMove.setDate(dateMove.getDate() + 1);
      console.log(dateMove)
    }
  }
  console.log('listDate :::: ',listDate)
  return listDate;
}
module.exports = router;