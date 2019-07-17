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
} = require('../global/middlewares');


router.get('/departemnt', async (req, res, next) => {
  res.status(200).json({
    query: req.query,
    results: info.department_results,
    department_id: (req.user) ? req.user.department_id : null,
  })
});

router.get('/study_group', async (req, res, next) => {
  const {
    page,
    page_length,
    department_id,
    building_id,
    is_mine,
    is_join,
  } = req.query;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.viewTableStudyGroup(connection, {
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
  let {
    building_id,
    sort_by_floor,
    date,
    start_time,
    end_time,
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
    let room_id_array = [];

    for (let i in results) {
      results[i].is_active = 1;
      room_id_array.push(results[i].room_id)
    }

    if (date && start_time && end_time) {
      let start_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(start_time)}`);
      let end_datetime = moment(`${foo.parseDate(date)} ${foo.parseTimeString(end_time)}`);
      let queryString = squel.select()
        .from('room_to_use')
        .join('room_rsv', null, 'room_rsv.room_rsv_id = room_to_use.room_rsv_id')
        .where('room_to_use.room_id IN ?', room_id_array)
        .where('room_rsv.rsv_status = ?', info.SUBMIT_RSV_STATUS)
        .where('room_rsv.start_datetime < ? && room_rsv.end_datetime > ?', end_datetime.format('YYYY-MM-DD HH:mm'), start_datetime.format('YYYY-MM-DD HH:mm'))
        .field('room_to_use.room_id')
        .group('room_to_use.room_id')
        .toParam();
      let rsv_results = await db_func.sendQueryToDB(connection, queryString);
      for (let i in results) {
        for (let j in rsv_results) {
          if (rsv_results[j].room_id == results[i].room_id) {
            results[i].is_active = 0;
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
        rsv_results = (await select_func.viewTableRoomRsv(connection, {
          room_id: room_id,
          rsv_status : info.SUBMIT_RSV_STATUS,
          start_datetime : moment(`${foo.parseDate(date)} 00:00`).format('YYYY-MM-DD HH:mm'),
          end_datetime : moment(`${foo.parseDate(date)} 24:00`).format('YYYY-MM-DD HH:mm'),
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

router.post('/room_rsv', checkReqInfo, async (req, res, next) => {
  const {
    room_id,
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
  if (room_id == undefined || date == undefined || time_id_array == undefined) {
    res.status(401).json({
      message: '필수값을 입력해주세요'
    })
  } else if (date != undefined && !_date.isValid()) {
    res.status(401).json({
      message: '날짜를 다시 입력해주세요'
    })
  } else {
    let connection;
    try {
      connection = await db_func.getDBConnection();
      let {
        results
      } = await select_func.room(connection, {
        room_id,
      });

      let min_date = (() => {
        let _min_date = moment();
        foo.resetTime(_min_date)
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
      } else if (_date < min_date) {
        res.status(401).json({
          message: `날짜를 다시 선택해주세요 현재로부터, ${results[0].rsv_apply_min_day}일 이후에 예약 가능합니다.`
        })
      } else {
        let is_holiday = (await select_func.viewTableRoomHoliday(connection, {
          room_id: results[0].room_id,
          building_id: results[0].building_id,
          date: moment(date).format('YYYY-MM-DD'),
        })).results[0] ? true : false;

        if (is_holiday) {
          res.status(401).json({
            message: '휴일입니다. 다른 날짜를 선택해주세요'
          })
        } else {
          let available_time_results = (await select_func.viewTableRoomAvailableTime(connection, {
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
            let rsv_results = (await select_func.viewTableRoomRsv(connection, {
              room_id: results[0].room_id,
              rsv_status : info.SUBMIT_RSV_STATUS,
              start_datetime : start_datetime.format('YYYY-MM-DD HH:mm'),
              end_datetime : end_datetime.format('YYYY-MM-DD HH:mm'),
            })).results;
            if (rsv_results[0]) {
              res.status(401).json({
                message: '이미 예약되었습니다.'
              })
            } else {
              await db_func.beginTransaction(connection);
              let insert_result = await insert_func.room_rsv(connection, {
                isTransaction: true,
                rsv_status : (results[0].is_require_rsv_accept) ? info.REQ_RSV_STATUS : info.SUBMIT_RSV_STATUS,
                room_rsv_category_id: 1,
                department_id,
                study_group_id,
                user_id: req.user ? req.user.user_id : null,
                start_datetime : start_datetime.format('YYYY-MM-DD HH:mm'),
                end_datetime : end_datetime.format('YYYY-MM-DD HH:mm'),
                student_count,
                non_student_count,
                representative_name,
                representative_phone,
                description,
              });
              await insert_func.room_to_use(connection, {
                isTransaction: true,
                room_rsv_id: insert_result.insertId,
                room_id_array: [room_id],
              })
              await insert_func.room_rsv_time(connection, {
                isTransaction: true,
                room_rsv_id: insert_result.insertId,
                time_array: available_time_results,
              })
              await db_func.commit(connection);
              foo.setRes(res, insert_result, {
                message: '성공했습니다'
              })
            }
          }
        }
      }
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
module.exports = router;