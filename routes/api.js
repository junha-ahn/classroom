const express = require('express');
const router = express.Router();
const moment = require('moment');
const squel = require('squel');

const db_func = require('../global/db_func');
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
  isAdmin,

  checkReqInfo,
  checkRequireInsertStudyGroup,
  checkRequireUpdateStudyGroup,
  checkRequirePerson,
  checkRequireInsertRoom,
  checkRequireUpdateRoom,
  checkRequireInsertRoomRsv,
  checkRequireUpdateRoomRsvStatus,
  checkRequirtUpdateUser,
  checkRequireUpdateUserType,
  checkRequireUpdateRoomRsv,
  checkRequireInsertRoomRsvAdmin,
  checkRequireHoliday,
  checkRequireAvailableTime,
} = require('../global/middlewares');

router.put('/user/:user_id', isLoggedIn, checkReqInfo, checkRequirtUpdateUser, db_func.inDBStream(async (req, res, next, conn) => {
  let user_id = req.params.user_id;
  let {
    department_id,
    campus_id,
    building_id,
    name,
    phone,
    is_student,
    student_number,
  } = req.body;

  if (req.user.user_type == info.USER_TYPE && req.user.user_id != user_id) {
    res.status(403).json({
      message: '권한이 없습니다'
    })
  } else {
    let {
      results
    } = await select_func.vUser(conn, {
      user_id,
      campus_id: req.user.campus_id,
      building_id: req.user.building_id,
    });
    if (!results[0]) {
      res.status(401).json({
        message: '다시 선택해주세요'
      })
    } else if (req.user.user_type == info.ADMIN_TYPE && !results[0]) {
      res.status(403).json({
        message: '권한이 없습니다'
      })
    } else if (results[0].user_type == info.ADMIN_TYPE && results[0].building_id != building_id) {
      res.status(403).json({
        message: '관리자 상태로, 학습관 이동 불가능합니다'
      })
    } else {
      let update_result = await update_func.person(conn, {
        user_id,
        department_id,
        campus_id,
        building_id,
        name,
        phone,
        is_student,
        student_number,
      })
      foo.setRes(res, update_result, {
        message: '성공했습니다'
      })
    }
  }
}));


router.put('/user/user_type/:user_id', isAdmin, checkRequireUpdateUserType, db_func.inDBStream(async (req, res, next, conn) => {
  let user_id = req.params.user_id;
  let {
    user_type,
  } = req.body;

  let {
    results
  } = await select_func.vUser(conn, {
    user_id,
    campus_id: req.user.campus_id,
    building_id: req.user.building_id,
  });

  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else if (results[0].user_type == user_type) {
    res.status(401).json({
      message: '이미 해당 권한입니다'
    })
  } else {
    let update_result = await update_func.userType(conn, {
      user_id,
      user_type,
    })
    foo.setRes(res, update_result, {
      message: '성공했습니다'
    })
  }
}));

router.get('/departemnt', async (req, res, next) => {
  res.status(200).json({
    query: req.query,
    results: info.department_results,
    department_id: (req.user) ? req.user.department_id : null,
  })
});

router.get('/study_group', db_func.inDBStream(async (req, res, next, conn) => {
  const {
    page,
    page_length,
    department_id,
    building_id,
    is_mine,
    is_join,
  } = req.query;

  let {
    results,
    list_count,
  } = await select_func.vStudyGroup(conn, {
    page,
    page_length,
    department_id,
    building_id,
    is_mine,
    is_join,
    user_id: (req.user) ? req.user.user_id : null,
  })

  foo.cleaningList(results);
  res.status(200).json({
    results,
    list_count,
    query: req.query,
  });
}));

router.post('/study_group', isLoggedIn, checkReqInfo, checkRequireInsertStudyGroup, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    department_id,
    building_id,
    name,
    description,
  } = req.body;

  let insert_result = await insert_func.studyGroup(conn, {
    user_id: req.user.user_id,
    department_id,
    building_id,
    name,
    description,
  })
  foo.setRes(res, insert_result, {
    message: '성공했습니다'
  })
}));
router.put('/study_group/:study_group_id', isLoggedIn, checkRequireUpdateStudyGroup, db_func.inDBStream(async (req, res, next, conn) => {
  let study_group_id = req.params.study_group_id;
  let {
    name,
    description,
  } = req.body;

  let update_result = await update_func.studyGroup(conn, {
    study_group_id,
    user_id: req.user.user_id,
    name,
    description,
  })
  foo.setRes(res, update_result, {
    message: '성공했습니다'
  })
}));

router.post('/study_group/join/:study_group_id', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let study_group_id = req.params.study_group_id;

  let {
    results,
  } = await select_func.studyGroup(conn, {
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
    let insert_result = await insert_func.studyGroupUser(conn, {
      study_group_id,
      user_id: req.user.user_id,
    })
    foo.setRes(res, insert_result, {
      message: '성공했습니다'
    })
  }
}));
router.delete('/study_group/join/:study_group_id', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let study_group_id = req.params.study_group_id;


  let delete_result = await delete_func.studyGroupUser(conn, {
    study_group_id,
    user_id: req.user.user_id,
  })
  foo.setRes(res, delete_result, {
    message: '성공했습니다'
  })
}));

router.put('/person/:person_id', isLoggedIn, checkReqInfo, checkRequirePerson, db_func.inDBStream(async (req, res, next, conn) => {
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

  let {
    results,
  } = await select_func.studyGroup(conn, {
    person_id,
    user_id: req.user.user_id,
  })
  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else {
    let update_result = await update_func.person(conn, {
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
}));

router.get('/room', db_func.inDBStream(async (req, res, next, conn) => {
  let {
    building_id,
    room_category_id,
    sort_by_floor,
    date,
    time_id_list,
    page,
    page_length,
  } = req.query;

  let {
    results,
    list_count,
  } = await select_func.room(conn, {
    building_id,
    room_category_id,
    sort_key: 'room_number',
    page,
    page_length,
  });
  await checkRoomTime(conn, {
    building_id,
    results,
    time_id_list,
    date,
  })
  foo.cleaningList(results, req.user);

  res.status(200).json({
    results: sort_by_floor ? roomSortByFloor(results) : results,
    list_count,
  })
}));
router.get('/room/floor/:building_id', db_func.inDBStream(async (req, res, next, conn) => {
  let building_id = req.params.building_id;

  let {
    results,
  } = await select_func.floor(conn, {
    building_id,
  });

  res.status(200).json({
    results,
  })
}));

router.post('/room', isAdmin, checkReqInfo, checkRequireInsertRoom, db_func.inDBStream(async (req, res, next, conn) => {
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

  let insert_result = await insert_func.room(conn, {
    building_id: req.user.building_id,
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
}));
router.put('/room/:room_id', isAdmin, checkReqInfo, checkRequireUpdateRoom, db_func.inDBStream(async (req, res, next, conn) => {
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

  let update_result = await update_func.room(conn, {
    room_id,
    building_id: req.user.building_id,
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
}));
router.delete('/room/:room_id', isAdmin, db_func.inDBStream(async (req, res, next, conn) => {
  let room_id = req.params.room_id;

  let {
    results,
  } = await select_func.room(conn, {
    room_id,
    building_id: req.user.building_id,
  })
  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else {
    let delete_result = await delete_func.room(conn, {
      building_id: req.user.building_id,
      room_id,
    })
    foo.setRes(res, delete_result, {
      message: '성공했습니다'
    })
  }
}));

router.get('/holiday', async (req, res, next) => {
  let {
    building_id,
    room_id,
    year,
    month,
    need_dates,
    is_only,
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
      } = await select_func.vRoomHoliday(connection, {
        room_id,
        building_id,
        year,
        month,
        is_only: room_id == null ? 1 : is_only,
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

router.post('/holiday', isAdmin, checkReqInfo, checkRequireHoliday, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    room_id,
    start_date,
    end_date,
    name,
    is_public_holiday,
  } = req.body;

  room_id = room_id || null;

  let insert_result = await insert_func.holiday(conn, {
    building_id: req.user.building_id,
    room_id,
    start_date: foo.parseDate(start_date),
    end_date: foo.parseDate(end_date),
    name,
    is_public_holiday,
  })
  foo.setRes(res, insert_result, {
    message: '성공했습니다'
  })
}));
router.put('/holiday/:holiday_id', isAdmin, checkReqInfo, checkRequireHoliday, db_func.inDBStream(async (req, res, next, conn) => {
  let holiday_id = req.params.holiday_id;

  const {
    start_date,
    end_date,
    name,
    is_public_holiday,
  } = req.body;

  let update_result = await update_func.holiday(conn, {
    building_id: req.user.building_id,
    holiday_id,
    start_date: foo.parseDate(start_date),
    end_date: foo.parseDate(end_date),
    name,
    is_public_holiday,
  })
  foo.setRes(res, update_result, {
    message: '성공했습니다'
  })
}));
router.delete('/holiday/:holiday_id', isAdmin, db_func.inDBStream(async (req, res, next, conn) => {
  let holiday_id = req.params.holiday_id;

  let {
    results,
  } = await select_func.holiday(conn, {
    holiday_id,
    building_id: req.user.building_id,
  })
  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else {
    let delete_result = await delete_func.holiday(conn, {
      building_id: req.user.building_id,
      holiday_id,
    })
    foo.setRes(res, delete_result, {
      message: '성공했습니다'
    })
  }
}));

router.get('/available_time', async (req, res, next) => {
  let {
    building_id,
    room_id,
    date,
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
        day_of_the_week,
        sort_key: 'start_time',
      });
      let {
        time_list,
        is_active,
      } = await checkRoomRsvTime(connection, {
        room_id_list: [room_id],
        building_id,
        start_datetime: moment(`${foo.parseDate(date)} 00:00`, 'YYYY-MM-DD HH:mm'),
        end_datetime: moment(`${foo.parseDate(date)} 24:00`, 'YYYY-MM-DD HH:mm'),
        time_list: results,
        is_reservationpage: true,

      });
      foo.cleaningList(time_list)
      res.status(200).json({
        results: time_list,
        list_count,
        is_active,
      })
    } catch (error) {
      next(error);
    } finally {
      db_func.release(connection);
    }
  }
});

router.post('/available_time', isAdmin, checkReqInfo, checkRequireAvailableTime, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    available_time_list,
    day_of_the_week,
  } = req.body;

  checkTimeList(available_time_list);

  await db_func.beginTransaction(conn);

  await delete_func.available_time(conn, {
    isTransaction: true,
    building_id: req.user.building_id,
    day_of_the_week,
  })
  if (available_time_list[0]) {
    await insert_func.available_time(conn, {
      isTransaction: true,
      building_id: req.user.building_id,
      day_of_the_week,
      time_list: available_time_list,
    })
  }
  await db_func.commit(conn);
  res.status(200).json({
    message: '성공'
  })
}));

router.get('/room_to_use/:room_rsv_id', db_func.inDBStream(async (req, res, next, conn) => {
  let room_rsv_id = req.params.room_rsv_id;

  let {
    results,
    list_count,
  } = await select_func.vRoomToUse(conn, {
    room_rsv_id,
  });
  foo.cleaningList(results);

  res.status(200).json({
    results,
    list_count,
  })
}));
router.get('/room_rsv_time/:room_rsv_id', db_func.inDBStream(async (req, res, next, conn) => {
  let room_rsv_id = req.params.room_rsv_id;

  let {
    results,
    list_count,
  } = await select_func.room_rsv_time(conn, {
    room_rsv_id,
  });
  foo.cleaningList(results);

  res.status(200).json({
    results,
    list_count,
  })
}));

router.post('/room_rsv', checkReqInfo, checkRequireInsertRoomRsv, db_func.inDBStream(async (req, res, next, conn) => {
  const {
    room_id,
    building_id,
    title,
    date,
    time_id_list,
    department_id,
    study_group_id,
    student_count,
    non_student_count,
    representative_name,
    representative_phone,
    description,
  } = req.body;

  let _date = moment(date);
  let {
    results
  } = await select_func.room(conn, {
    room_id,
    building_id,
  });

  let now = moment();
  let min_date = (() => {
    let _min_date = now;
    if (results[0]) {
      _min_date.date(_min_date.date() + results[0].rsv_apply_min_day);
    }
    return _min_date;
  })();
  if (!results[0]) {
    res.status(401).json({
      message: '강의실을 다시 선택해주세요'
    })
  } else if (!foo.checkPermission(req.user, results[0].auth_rsv_create)) {
    res.status(401).json({
      message: '강의실을 예약할 권한이 없습니다. 다시 선택해주세요'
    })
  } else if (now < min_date) {
    res.status(401).json({
      message: `날짜를 다시 선택해주세요. ${foo.parseDate(min_date)}일 이전에는 예약 불가능합니다.`
    })
  } else {
    let is_holiday = (await select_func.vRoomHoliday(conn, {
      room_id: results[0].room_id,
      building_id: results[0].building_id,
      date: moment(date).format('YYYY-MM-DD'),
    })).results[0] ? true : false;

    if (is_holiday) {
      res.status(401).json({
        message: '휴일입니다. 다른 날짜를 선택해주세요'
      })
    } else {
      let available_time_results = (await select_func.vRoomAvailableTime(conn, {
        building_id: results[0].building_id,
        room_id: results[0].room_id,
        time_id_list,
        day_of_the_week: _date.day(),
        sort_key: 'start_time',
        sort_type: true,
      })).results;
      if (!available_time_results[0] || time_id_list.length != available_time_results.length) {
        res.status(401).json({
          message: '시간을 다시 선택해주세요'
        })
      } else {
        let start_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(available_time_results[0].start_time)}`);
        let end_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(available_time_results[available_time_results.length - 1].end_time)}`);
        let rsv_status = (results[0].is_require_rsv_accept) ? info.REQ_RSV_STATUS : info.SUBMIT_RSV_STATUS
        if (rsv_status == info.SUBMIT_RSV_STATUS) {
          await checkRoomRsvTime(conn, {
            room_id_list: [room_id],
            building_id: building_id,
            start_datetime,
            end_datetime,
            time_list: available_time_results,
          });
        }

        await db_func.beginTransaction(conn);
        let insert_result = await insert_func.room_rsv(conn, {
          isTransaction: true,
          building_id,
          rsv_status,
          room_rsv_category_id: 1,
          title,
          department_id,
          study_group_id,
          user_id: req.user ? req.user.user_id : null,
          start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
          end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),
          student_count,
          non_student_count,
          representative_name,
          representative_phone,
          description,
        });
        await insert_func.room_to_use(conn, {
          isTransaction: true,
          room_rsv_id: insert_result.insertId,
          room_id_list: [room_id],
        })
        await insert_func.room_rsv_time(conn, {
          isTransaction: true,
          room_rsv_id: insert_result.insertId,
          time_list: available_time_results,
        })
        await db_func.commit(conn);
        foo.setRes(res, insert_result, {
          message: '성공했습니다'
        })
      }
    }
  }
}));
router.post('/admin/room_rsv', isAdmin, checkReqInfo, checkRequireInsertRoomRsvAdmin, db_func.inDBStream(async (req, res, next, conn) => {
  const {
    rsv_status,
    room_rsv_category_id,
    room_id_list,
    title,
    date,
    time_list,
    department_id,
    study_group_id,
    student_count,
    non_student_count,
    representative_name,
    representative_phone,
    description,
  } = req.body;

  let {
    results
  } = await select_func.room(conn, {
    room_id_list,
    building_id: req.user.building_id,
  });

  if (results.length != room_id_list.length) {
    res.status(401).json({
      message: '강의실을 다시 선택해주세요'
    })
  } else {
    checkTimeList(time_list);

    let end_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString((foo.sortByKey(time_list, 'end_time'))[time_list.length - 1].end_time)}`);
    let start_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString((foo.sortByKey(time_list, 'start_time'))[0].start_time)}`);

    if (rsv_status == info.SUBMIT_RSV_STATUS || rsv_status == info.CANCEL_REQ_RSV_STATUS) {
      await checkRoomRsvTime(conn, {
        room_id_list,
        building_id: req.user.building_id,
        start_datetime,
        end_datetime,
        time_list,
      });
    }

    await db_func.beginTransaction(conn);
    let insert_result = await insert_func.room_rsv(conn, {
      isTransaction: true,
      building_id: req.user.building_id,
      rsv_status,
      room_rsv_category_id,
      title,
      department_id,
      study_group_id,
      user_id: req.user ? req.user.user_id : null,
      start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
      end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),
      student_count,
      non_student_count,
      representative_name,
      representative_phone,
      description,
    });
    await insert_func.room_to_use(conn, {
      isTransaction: true,
      room_rsv_id: insert_result.insertId,
      room_id_list,
    })
    await insert_func.room_rsv_time(conn, {
      isTransaction: true,
      room_rsv_id: insert_result.insertId,
      time_list,
    })
    await db_func.commit(conn);
    foo.setRes(res, insert_result, {
      message: '성공했습니다'
    })
  }
}));

router.put('/room_rsv/:room_rsv_id', isAdmin, checkRequireUpdateRoomRsv, db_func.inDBStream(async (req, res, next, conn) => {
  const room_rsv_id = req.params.room_rsv_id;
  let {
    room_rsv_category_id,
    department_id,
    study_group_id,
    title,
    student_count,
    non_student_count,
    representative_name,
    representative_phone,
    description,

    time_list,
    room_id_list,
  } = req.body;

  let {
    results,
  } = await select_func.room_rsv(conn, {
    room_rsv_id,
    building_id: req.user.building_id,
  });
  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택하세요',
    })
  } else {
    let date = foo.parseDate(results[0].start_datetime, true, true);

    let start_datetime, end_datetime;

    let _room_id_list = [];
    let _time_list = [];

    for (let i in time_list) {
      let _start_datetime = moment(`${date} ${time_list[i].start_time}`);
      let _end_datetime = moment(`${date} ${time_list[i].end_time}`);
      if (_start_datetime.isValid() && _end_datetime.isValid()) {
        if (start_datetime == null || start_datetime > _start_datetime) {
          start_datetime = _start_datetime;
        }
        if (end_datetime == null || end_datetime < _end_datetime) {
          end_datetime = _end_datetime;
        }
        _time_list.push({
          start_time: time_list[i].start_time,
          end_time: time_list[i].end_time,
        });
      }
    }
    checkTimeList(time_list);

    for (let i in room_id_list) {
      let room_id = parseInt(room_id_list[i]);
      if (!isNaN(room_id)) {
        _room_id_list.push(room_id);
      }
    }
    if (!_time_list[0] || !_room_id_list[0]) {
      res.status(401).json({
        message: '예약 시간과 강의실을 하나 이상 입력하세요'
      })
    } else if (_time_list.length != time_list.length) {
      res.status(401).json({
        message: '예약 시간을 다시 입력하세요'
      })
    } else if (_room_id_list.length != room_id_list.length) {
      res.status(401).json({
        message: '강의실을 다시 입력하세요'
      })
    } else {
      if (results[0].rsv_status == info.SUBMIT_RSV_STATUS || results[0].rsv_status == info.CANCEL_REQ_RSV_STATUS) {
        await checkRoomRsvTime(conn, {
          room_rsv_id: results[0].room_rsv_id,
          room_id_list: _room_id_list,
          building_id: req.user.building_id,
          start_datetime,
          end_datetime,
          time_list: _time_list,
        });
      }
      await db_func.beginTransaction(conn);
      let isTransaction = true;

      let update_result = await update_func.room_rsv(conn, {
        isTransaction,
        room_rsv_id,

        start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
        end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),

        room_rsv_category_id,
        department_id,
        study_group_id,
        title,
        student_count,
        non_student_count,
        representative_name,
        representative_phone,
        description,
      });

      await delete_func.room_rsv_time(conn, {
        isTransaction,
        room_rsv_id,
      })
      await delete_func.room_to_use(conn, {
        isTransaction,
        room_rsv_id,
      })
      await insert_func.room_rsv_time(conn, {
        isTransaction,
        room_rsv_id,
        time_list: _time_list,
      })
      await insert_func.room_to_use(conn, {
        isTransaction,
        room_rsv_id,
        room_id_list: _room_id_list,
      })
      await addNotification(conn, {
        isTransaction,
        notification_type: 2,
        sender_id: req.user.user_id,
        receiver_id: results[0].user_id,
        room_rsv_id,
      })
      await db_func.commit(conn);
      foo.setRes(res, update_result, {
        message: '성공했습니다'
      })
    }
  }
}));
router.put('/room_rsv/cancel/:room_rsv_id', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  const room_rsv_id = req.params.room_rsv_id;

  let {
    results
  } = await select_func.room_rsv(conn, {
    room_rsv_id,
  });
  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else if (results[0].user_id != req.user.user_id) {
    res.status(401).json({
      message: '본인의 예약을 선택해주세요'
    })
  } else if (results[0].rsv_status != info.SUBMIT_RSV_STATUS) {
    res.status(401).json({
      message: '승인상태가 아닌 예약은 취소 불가능합니다'
    })
  } else {
    let room_results = (await select_func.vRsvRoomsRequire(conn, {
      room_rsv_id,
    })).results;

    let is_require_cancel_accept = false;
    let now = moment();

    let date_message;

    for (let i in room_results) {
      let min_date = moment(results[0].start_datetime, 'YYYY-DD-MM');
      min_date.date(min_date.date() - room_results[i].rsv_cancel_min_day)

      if (room_results[i].is_require_cancel_accept == 1) {
        is_require_cancel_accept = true;
      }
      if (min_date < now) {
        date_message = `${foo.parseDate(min_date)}일 이후에 취소 불가능합니다\n(${room_results[i].name} 예약 날짜로부터 ${room_results[i].rsv_cancel_min_day}일전 취소 불가능)`
      }
    }
    if (date_message != null) {
      res.status(401).json({
        message: date_message,
      })
    } else {
      let update_result = await update_func.room_rsv_status(conn, {
        room_rsv_id,
        rsv_status: (is_require_cancel_accept) ? info.CANCEL_REQ_RSV_STATUS : info.CANCEL_RSV_STATUS,
      })
      foo.setRes(res, update_result, {
        message: is_require_cancel_accept ? '예약 취소 요청 했습니다.' : '예약을 취소 했습니다.'
      })
    }
  }
}));
router.put('/room_rsv/status/:room_rsv_id', checkReqInfo, isAdmin, checkRequireUpdateRoomRsvStatus, db_func.inDBStream(async (req, res, next, conn) => {
  const room_rsv_id = req.params.room_rsv_id;
  let {
    rsv_status,
  } = req.body;

  let {
    results
  } = await select_func.room_rsv(conn, {
    room_rsv_id,
    building_id: req.user.building_id,
  });
  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else if (results[0].rsv_status == rsv_status) {
    res.status(401).json({
      message: '이미 해당 예약상태입니다'
    })
  } else {
    if (rsv_status == info.SUBMIT_RSV_STATUS || rsv_status == info.CANCEL_REQ_RSV_STATUS) {
      let start_datetime = moment(foo.parseDateTime(results[0].start_datetime, true, true));
      let end_datetime = moment(foo.parseDateTime(results[0].end_datetime, true, true));

      let time_list = (await select_func.room_rsv_time(conn, {
        room_rsv_id,
      })).results;
      let room_results = (await select_func.vRsvRoomsRequire(conn, {
        room_rsv_id,
      })).results;
      let room_id_list = [];
      for (let i in room_results) {
        room_id_list.push(room_results[i].room_id);
      }

      await checkRoomRsvTime(conn, {
        room_rsv_id,
        room_id_list,
        building_id: req.user.building_id,
        start_datetime,
        end_datetime,
        time_list,
      });
    }
    let isTransaction = false;
    if (results[0].user_id) {
      await db_func.beginTransaction(conn);
      isTransaction = true;
    }
    let update_result = await update_func.room_rsv_status(conn, {
      isTransaction,
      room_rsv_id,
      rsv_status,
    })
    if (isTransaction) {
      await addNotification(conn, {
        isTransaction,
        notification_type: 1,
        sender_id: req.user.user_id,
        receiver_id: results[0].user_id,
        room_rsv_id,
      })
      await db_func.commit(conn);
    }
    foo.setRes(res, update_result, {
      message: '예약 상태 변경을 성공했습니다'
    })
  }
}));
router.delete('/room_rsv/:room_rsv_id', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  const room_rsv_id = req.params.room_rsv_id;

  let {
    results
  } = await select_func.room_rsv(conn, {
    room_rsv_id,
  });

  if (!results[0]) {
    res.status(401).json({
      message: '다시 선택해주세요'
    })
  } else if (req.user.user_type == info.USER_TYPE && results[0].user_id != req.user.user_id) {
    res.status(401).json({
      message: '본인의 예약을 선택해주세요'
    })
  } else if (req.user.user_type == info.USER_TYPE && results[0].rsv_status != info.REQ_RSV_STATUS) {
    res.status(401).json({
      message: '요청상태가 아닌 예약은 삭제 불가능합니다'
    })
  } else if (req.user.user_type == info.ADMIN_TYPE && results[0].building_id != req.user.building_id) {
    res.status(401).json({
      message: '본인의 학습관 예약을 삭제해주세요'
    })
  } else {
    let delete_result = await delete_func.room_rsv(conn, {
      room_rsv_id,
    })
    foo.setRes(res, delete_result, {
      message: '예약 요청을 삭제했습니다.'
    })
  }
}));

router.put('/notification/read', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    notification_id
  } = req.body;
  let update_result = await update_func.notificationRead(conn, {
    notification_id,
    receiver_id: req.user.user_id,
  })
  foo.setRes(res, update_result, {
    message: '성공했습니다'
  })
}));
router.delete('/notification', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    notification_id
  } = req.body;
  let delete_result = await delete_func.notification(conn, {
    notification_id,
    receiver_id: req.user.user_id,
  })
  foo.setRes(res, delete_result, {
    message: '성공했습니다'
  })
}));

router.get('/notification', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    room_rsv_id,
    is_read,
    page,
    page_length,
    sort_key,
    sort_type
  } = req.query;

  let {
    results,
    list_count,
  } = await select_func.notification(conn, {
    receiver_id: req.user.user_id,
    room_rsv_id,
    is_read,
    page,
    page_length,
    sort_key,
    sort_type,
  });
  foo.cleaningList(results);

  res.status(200).json({
    results,
    list_count,
  })
}));

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

function getDates(holiday_results) {
  let dates = [];
  for (let i in holiday_results) {
    getDateRange(foo.parseDate(holiday_results[i].start_date), foo.parseDate(holiday_results[i].end_date), dates);
  }
  return dates;
}

function getDateRange(startDate, endDate, listDate) {
  let dateMove = new Date(startDate);
  let strDate = startDate;
  if (startDate == endDate) {
    strDate = dateMove.toISOString().slice(0, 10);
    listDate.push(strDate);
  } else {
    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      listDate.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }
  }
  return listDate;
}

function addNotification(conn, object) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        isTransaction,
        notification_type,
        sender_id,
        receiver_id,
        room_rsv_id,
      } = object;
      if (sender_id != receiver_id && receiver_id != null) {
        let {
          results,
        } = await select_func.notification(conn, {
          isTransaction,
          notification_type,
          sender_id,
          receiver_id,
          room_rsv_id,
          is_read: 0,
        });
        if (results[0]) {
          await update_func.notificationCount(conn, {
            isTransaction,
            notification_id: results[0].notification_id,
          });
        } else {
          await insert_func.notification(conn, {
            isTransaction,
            notification_type,
            sender_id,
            receiver_id,
            room_rsv_id,
          });
        }
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function checkRoomRsvTime(conn, object) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        isTransaction,
        room_rsv_id,
        start_datetime,
        end_datetime,
        building_id,
        room_id_list,
        time_list,
        is_reservationpage,
      } = object;

      let {
        results
      } = await select_func.checkRoomRsvTime(conn, {
        isTransaction,
        not_room_rsv_id: room_rsv_id,
        building_id,
        room_id_list,
        start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
        end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),
      });
      let is_active = false;
      for (let i in time_list) {
        if (is_reservationpage) {
          time_list[i].is_seleted = 0;
          time_list[i].is_active = 1;
          time_list[i].start_time_string = foo.parseTimeString(time_list[i].start_time, true)
          time_list[i].end_time_string = foo.parseTimeString(time_list[i].end_time, true)
        }
        let start_dtime = moment('1970/1/1 ' + time_list[i].start_time, "YYYY-MM-DD HH:mm");
        let end_dtime = moment('1970/1/1 ' + time_list[i].end_time, "YYYY-MM-DD HH:mm");
        for (let j in results) {
          let _start_dtime = moment('1970/1/1 ' + results[j].start_time, "YYYY-MM-DD HH:mm");
          let _end_dtime = moment('1970/1/1 ' + results[j].end_time, "YYYY-MM-DD HH:mm");

          if (_start_dtime < end_dtime && _end_dtime > start_dtime) {
            if (is_reservationpage) {
              time_list[i].is_active = 0;
            } else {
              let error = new Error();
              error.message = `시간을 다시 선택해주세요 (${results[j].title} : ${foo.parseTimeString(results[j].start_time)} ~ ${foo.parseTimeString(results[j].end_time)})`
              error.status = 401;
              throw error;
            }
          }
        }
        if (time_list[i].is_active) {
          is_active = true;
        }
      }
      if (is_reservationpage) {
        resolve({
          is_active,
          time_list
        })
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function checkRoomTime(conn, object) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        isTransaction,
        building_id,
        results,
        time_id_list,
        date,
      } = object;
      if (time_id_list != null) {
        time_id_list = JSON.parse(time_id_list);
      }
      let room_id_list = [];
    
      for (let i in results) {
        results[i].is_active = 1;
        room_id_list.push(results[i].room_id)
      }
      if (date && time_id_list[0] && room_id_list[0]) {
        let _date = new Date(date);
        let available_time_results = (await select_func.vRoomAvailableTime(conn, {
          building_id: results[0].building_id,
          room_id: results[0].room_id,
          time_id_list,
          day_of_the_week: _date.getDay(),
          sort_key: 'start_time',
          sort_type: true,
        })).results;
        if (!available_time_results[0] || time_id_list.length != available_time_results.length) {
          let error = new Error('시간을 다시 선택해주세요');
          error.status = 401;
          throw error;
        } else {
          let holidayQueryString = squel.select()
            .from('holiday')
            .where('room_id IN ?', room_id_list)
            .where('holiday.start_date <= ? AND holiday.end_date >= ?', date, date)
            .toParam();
          let holiday_results = await db_func.sendQueryToDB(conn, holidayQueryString);

          let start_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(available_time_results[0].start_time)}`);
          let end_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(available_time_results[available_time_results.length - 1].end_time)}`);
          let rsv_time_results = (await select_func.checkRoomRsvTime(conn, {
            isTransaction,
            building_id,
            room_id_list,
            start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
            end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),
          })).results;
  
          for (let i in results) {
            for (let j in holiday_results) {
              if (holiday_results[j].room_id == results[i].room_id) {
                results[i].is_active = 0;
                results[i].message = `[ ${holiday_results[j].name }]\n다른 날짜를 선택해주세요`
                break;
              }
            }
            if (results[i].is_active == 0)
              continue;

            for (let j in available_time_results) {
              let start_dtime = moment('1970/1/1 ' + available_time_results[j].start_time, "YYYY-MM-DD HH:mm");
              let end_dtime = moment('1970/1/1 ' + available_time_results[j].end_time, "YYYY-MM-DD HH:mm");
              for (let k in rsv_time_results) {
                if (results[i].room_id != rsv_time_results[k].room_id) 
                  continue;
                
                let _start_dtime = moment('1970/1/1 ' + rsv_time_results[k].start_time, "YYYY-MM-DD HH:mm");
                let _end_dtime = moment('1970/1/1 ' + rsv_time_results[k].end_time, "YYYY-MM-DD HH:mm");

                if (_start_dtime < end_dtime && _end_dtime > start_dtime) {
                  results[i].is_active = 0;
                  results[i].message = `시간을 다시 선택해주세요 (${rsv_time_results[k].title} : ${foo.parseTimeString(rsv_time_results[k].start_time)} ~ ${foo.parseTimeString(rsv_time_results[k].end_time)})`
                  break;
                }
              }
            }
          }
        }
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function checkTimeList(time_list) {
  for (let i in time_list) {
    let start_dtime = moment('1970/1/1 ' + time_list[i].start_time, "YYYY-MM-DD HH:mm");
    let end_dtime = moment('1970/1/1 ' + time_list[i].end_time, "YYYY-MM-DD HH:mm");
    for (let j = parseInt(i) + 1; j < time_list.length; j++) {
      let _start_dtime = moment('1970/1/1 ' + time_list[j].start_time, "YYYY-MM-DD HH:mm");
      let _end_dtime = moment('1970/1/1 ' + time_list[j].end_time, "YYYY-MM-DD HH:mm");

      if (_start_dtime < end_dtime && _end_dtime > start_dtime) {
        let error = new Error();
        error.message = `시간을 다시 선택해주세요`
        error.status = 401;
        throw error;
      }
    }
  }
}
module.exports = router;