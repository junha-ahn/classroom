const express = require('express');
const router = express.Router();
const moment = require('moment');
const squel = require('squel');

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
  checkRequireInsertStudyGroup,
  checkRequirtUpdateStudyGroup,
  checkRequirePerson,
  checkRequireInsertRoom,
  checkRequireUpdateRoom,
  checkRequireInsertRoomRsv,
  checkRequireUpdateRoomRsvStatus,
  checkRequirtUpdateUser,
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
router.put('/study_group/:study_group_id', isLoggedIn, checkRequirtUpdateStudyGroup, db_func.inDBStream(async (req, res, next, conn) => {
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
    sort_by_floor,
    date,
    start_time,
    end_time,
  } = req.query;

  let {
    results,
    list_count,
  } = await select_func.room(conn, {
    building_id,
    sort_key: 'room_number',
  });
  let room_id_array = [];

  for (let i in results) {
    results[i].is_active = 1;
    room_id_array.push(results[i].room_id)
  }

  if (date && start_time && end_time && room_id_array[0]) {
    date = foo.parseDate(date);

    let start_datetime = moment(`${date} ${foo.parseTimeString(start_time)}`);
    let end_datetime = moment(`${date} ${foo.parseTimeString(end_time)}`);
    let rsvQeuryString = squel.select()
      .from('room_to_use')
      .join('room_rsv', null, 'room_rsv.room_rsv_id = room_to_use.room_rsv_id')
      .where('room_to_use.room_id IN ?', room_id_array)
      .where('room_rsv.rsv_status = ?', info.SUBMIT_RSV_STATUS)
      .where('room_rsv.start_datetime < ? && room_rsv.end_datetime > ?', end_datetime.format('YYYY-MM-DD HH:mm'), start_datetime.format('YYYY-MM-DD HH:mm'))
      .field('room_to_use.room_id')
      .group('room_to_use.room_id')
      .toParam();
    let holidayQueryString = squel.select()
      .from('holiday')
      .where('room_id IN ?', room_id_array)
      .where('holiday.start_date <= ? AND holiday.end_date >= ?', date, date)
      .toParam();
    let holiday_results = await db_func.sendQueryToDB(conn, holidayQueryString);
    let rsv_results = await db_func.sendQueryToDB(conn, rsvQeuryString);
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
      for (let j in rsv_results) {
        if (rsv_results[j].room_id == results[i].room_id) {
          results[i].is_active = 0;
          results[i].message = `이미 예약됬습니다.`
          break;
        }
      }
    }
  }
  foo.cleaningList(results, req.user);
  res.status(200).json({
    results: sort_by_floor ? roomSortByFloor(results) : results,
    list_count,
  })
}));

router.post('/room', isAdmin, checkReqInfo, checkRequireInsertRoom, db_func.inDBStream(async (req, res, next, conn) => {
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

  let insert_result = await insert_func.room(conn, {
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
      } = await select_func.vRoomHoliday(connection, {
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
      let rsv_results;
      if (room_id) {
        rsv_results = (await select_func.vRoomRsv(connection, {
          room_id: room_id,
          rsv_status: info.SUBMIT_RSV_STATUS,
          start_datetime: moment(`${foo.parseDate(date)} 00:00`).format('YYYY-MM-DD HH:mm'),
          end_datetime: moment(`${foo.parseDate(date)} 24:00`).format('YYYY-MM-DD HH:mm'),
        })).results;

      }
      let is_active = false;
      for (let i in results) {
        results[i].is_seleted = 0;
        results[i].is_active = 1;
        results[i].start_time_string = foo.parseTimeString(results[i].start_time, true)
        results[i].end_time_string = foo.parseTimeString(results[i].end_time, true)

        for (let j in rsv_results) {
          let _start = moment(`${foo.parseDate(date)} ${results[i].start_time}`);
          let _end = moment(`${foo.parseDate(date)} ${results[i].end_time}`);
          let start_datetime = moment(foo.parseDateTime(rsv_results[j].start_datetime, true));
          let end_datetime = moment(foo.parseDateTime(rsv_results[j].end_datetime, true));
          if (_start < end_datetime && _end > start_datetime) {
            results[i].is_active = 0;
          }
        }
        if (results[i].is_active) {
          is_active = true;
        }
      }

      res.status(200).json({
        results,
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

router.post('/room_rsv', checkReqInfo, checkRequireInsertRoomRsv, db_func.inDBStream(async (req, res, next, conn) => {
  const {
    room_id,
    title,
    date,
    time_id_array,
    department_id,
    study_group_id,
    student_count,
    non_student_count,
    representative_name,
    representative_phone,
    description,
  } = req.body;

  let _date = foo.resetTime(moment(date));
  if (date != undefined && !_date.isValid()) {
    res.status(401).json({
      message: '날짜를 다시 입력해주세요'
    })
  } else {
    let {
      results
    } = await select_func.room(conn, {
      room_id,
    });

    let now = foo.resetTime(moment());
    let min_date = (() => {
      let _min_date = now;
      _min_date.date(_min_date.date() + results[0].rsv_apply_min_day);
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
          time_id_array,
          day_of_the_week: _date.day(),
          sort_key: 'start_time',
          sort_type: true,
        })).results;
        if (!available_time_results[0] || time_id_array.length != available_time_results.length) {
          res.status(401).json({
            message: '시간을 다시 선택해주세요'
          })
        } else {
          let start_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(available_time_results[0].start_time)}`);
          let end_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(available_time_results[available_time_results.length - 1].end_time)}`);
          let rsv_results = (await select_func.vRoomRsv(conn, {
            room_id: results[0].room_id,
            rsv_status: info.SUBMIT_RSV_STATUS,
            start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
            end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),
          })).results;
          if (rsv_results[0]) {
            res.status(401).json({
              message: '이미 예약되었습니다.'
            })
          } else {
            await db_func.beginTransaction(conn);
            let insert_result = await insert_func.room_rsv(conn, {
              isTransaction: true,
              rsv_status: (results[0].is_require_rsv_accept) ? info.REQ_RSV_STATUS : info.SUBMIT_RSV_STATUS,
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
              room_id_array: [room_id],
            })
            await insert_func.room_rsv_time(conn, {
              isTransaction: true,
              room_rsv_id: insert_result.insertId,
              time_array: available_time_results,
            })
            await db_func.commit(conn);
            foo.setRes(res, insert_result, {
              message: '성공했습니다'
            })
          }
        }
      }
    }
  }
}));


router.delete('/room_rsv/:room_rsv_id', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  const room_rsv_id = req.params.room_rsv_id;

  let {
    results
  } = await select_func.room_rsv(conn, {
    room_rsv_id,
  });
  // 관리자일때, 건물 체크!
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
  } else {
    let my_building = true;
    if (req.user.user_type == info.ADMIN_TYPE) {
      let {
        results,
      } = await select_func.vRoomToUse(conn, {
        room_rsv_id,
      })
      my_building = results[0] && results[0].building_id == req.user.building_id 
        ? true : false;
    }
    if (!my_building) {
      res.status(403).json({
        message: '본인의 학습관 예약을 선택해주세요'
      })
    } else {
      let delete_result = await delete_func.room_rsv(conn, {
        room_rsv_id,
      })
      foo.setRes(res, delete_result, {
        message: '예약 요청을 삭제했습니다.'
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
    let date_message;

    for (let i in room_results) {
      let now = foo.resetTime(moment());
      let min_date = (() => {
        let _min_date = moment(foo.parseDateTime(room_results[i].start_datetime, true));
        foo.resetTime(_min_date)
        _min_date.date(_min_date.date() - room_results[i].rsv_cancel_min_day);
        return _min_date;
      })();
      if (room_results[i].is_require_cancel_accept == 1) {
        is_require_cancel_accept = true;
      }
      if (now > min_date) {
        date_message = `${foo.parseDate(min_date)}일 이후에 취소 불가능합니다.`
      }
    }
    if (date_message) {
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
    let already_reserved = false;
    if (rsv_status == info.SUBMIT_RSV_STATUS) {
      let room_results = (await select_func.vRsvRoomsRequire(conn, {
        room_rsv_id,
      })).results;
      let room_id_list = [];
      for (let i in room_results) {
        room_id_list.push(room_results[i].room_id);
      }
      let start_datetime = moment(foo.parseDateTime(results[0].start_datetime, true));
      let end_datetime = moment(foo.parseDateTime(results[0].end_datetime, true));
      let rsv_results = (await select_func.vRoomRsv(conn, {
        room_id_list,
        rsv_status: info.SUBMIT_RSV_STATUS,
        start_datetime: start_datetime.format('YYYY-MM-DD HH:mm'),
        end_datetime: end_datetime.format('YYYY-MM-DD HH:mm'),
      })).results;
      if (rsv_results[0]) {
        already_reserved = true;
      }
    }
    if (already_reserved) {
      res.status(401).json({
        message: '이미 승인된 예약이 있습니다.',
      })
    } else {
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
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = router;