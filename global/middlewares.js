const info = require('./info')
const foo = require('./foo')

const db_func = require('./db_func')

const {
  select_func,
} = require('../query/index');

const checkRequire = (request, requireList = []) => {
  let flag = '';
  for (let i in requireList) {
    let name = requireList[i];
    if (request[name] == undefined && request[name] == null) {
      flag = name;
      break;
    }
  }
  return flag;
};

let self = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).render('error', foo.getResJson(req.user, {
        error_name: '권한 문제',
        message: '로그인이 필요합니다',
      }));
    }
  },
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.user_type == info.ADMIN_TYPE) {
        next()
      } else {
        res.status(403).render('error', foo.getResJson(req.user, {
          error_name: '권한 문제',
          message: '관리자 접근 권한입니다',
        }));
      }
    } else {
      res.status(403).render('error', foo.getResJson(req.user, {
        error_name: '권한 문제',
        message: '관리자로 로그인을 해주세요',
      }));
    }
  },
  isNotLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(403).render('error', foo.getResJson(req.user, {
        error_name: '권한 문제',
        message: '로그아웃이 필요합니다',
      }));
    }
  },

  
  checkReqInfo: (req, res, next) => {
    if (req.body.department_id != null && info.department_object[req.body.department_id] == undefined) {
      res.status(401).json({
        message: '학과를 다시 선택해주세요'
      })
    } else if (req.body.campus_id != null && info.campus_object[req.body.campus_id] == undefined) {
      res.status(401).json({
        message: '캠퍼스를 다시 선택해주세요'
      })
    } else if (req.body.building_id != null && info.building_object[req.body.building_id] == undefined) {
      res.status(401).json({
        message: '건물을 다시 선택해주세요'
      })
    } else if (req.body.rsv_status != null && !info.RSV_STATUS_ARRAY.includes(req.body.rsv_status)) {
      res.status(401).json({
        message: '상태를 다시 선택해주세요'
      })
    } else {
      next();
    }
  },
  checkRequireInsertStudyGroup: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'name',
      'department_id',
      'building_id',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequirtUpdateStudyGroup: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'name',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequirePerson: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'campus_id',
      'building_id',
      'is_student',
      'name',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireInsertRoom: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'building_id',
      'room_category_id',
      'auth_rsv_create',
      'auth_rsv_cancel',
      'name',
      'room_number',
      'floor',
      'is_require_rsv_accept',
      'is_require_cancel_accept',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireUpdateRoom: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'room_category_id',
      'auth_rsv_create',
      'auth_rsv_cancel',
      'name',
      'room_number',
      'floor',
      'is_require_rsv_accept',
      'is_require_cancel_accept',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireInsertRoomRsv: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'room_id',
      'date',
      'time_id_array',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireUpdateRoomRsvStatus: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'rsv_status',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },


  getRerservationLookup: (is_admin) => {
    return async function (req, res, next) {
      let building_id = (is_admin) ? req.user.building_id : req.params.building_id;
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
          } = await select_func.vRoomRsvList(connection, {
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
          let study_group_results = (await select_func.vStudyGroup(connection, {
            department_id,
            building_id,
            user_id: (req.user) ? req.user.user_id : null,
          })).results;
          foo.cleaningList(results);
          foo.cleaningList(study_group_results);
          res.render((is_admin ? 'admin' : 'user') + '/reservation_lookup'
          ,  foo.getResJson(req.user, {
            params: req.params,
            query: {
              ...req.query,
              department_id: department_id || 0,
              study_group_id: study_group_id || 0,
              rsv_status: rsv_status || 0,
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
    }
  },
  getRerservationSingle: (is_admin) => {
    return db_func.inDBStream(async (req, res, next, conn) => {
      let room_rsv_id = req.params.room_rsv_id;
      let {
        results
      } = await select_func.vRoomRsvSingle(conn, {
        room_rsv_id,
        user_id: req.user ? req.user.user_id : null,
      });
    
      if (!results[0]) {
        res.render('error', foo.getResJson(req.user, {
          error_name: "예약을 찾을수 없습니다",
          message: "다시 확인해주세요"
        }));
      } else {
        let room_to_use_results = (await select_func.vRoomToUse(conn, {
          room_rsv_id,
        })).results;
        let room_rsv_time_results = (await select_func.room_rsv_time(conn, {
          room_rsv_id,
        })).results;
        foo.cleaningList(results);
        foo.cleaningList(room_rsv_time_results);
        res.render((is_admin ? 'admin' : 'user') + '/reservation_single'
        , foo.getResJson(req.user, {
          params: req.params,
          reservation: results[0],
          room_to_use_results,
          room_rsv_time_results,
          rsv_status_results: info.rsv_status_results,
          room_rsv_category_results: info.room_rsv_category_results,
        }));
      }
    });
  },
}

module.exports = self;