const moment = require('moment');
const info = require('./info')
const foo = require('./foo')

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
  renderIsLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).render('error', foo.getResJson(req.user, {
        error_name: '권한 문제',
        message: '로그인이 필요합니다',
      }));
    }
  },
  renderIsAdmin: (req, res, next) => {
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
  renderIsNotLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(403).render('error', foo.getResJson(req.user, {
        error_name: '권한 문제',
        message: '로그아웃이 필요합니다',
      }));
    }
  },

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).json(foo.getResJson(req.user, {
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
        res.status(403).json(foo.getResJson(req.user, {
          error_name: '권한 문제',
          message: '관리자 접근 권한입니다',
        }));
      }
    } else {
      res.status(403).json(foo.getResJson(req.user, {
        error_name: '권한 문제',
        message: '관리자로 로그인을 해주세요',
      }));
    }
  },
  isNotLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(403).json(foo.getResJson(req.user, {
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
    } else if (req.body.building_id != null && req.body.campus_id != null && info.building_object[req.body.building_id].campus_id != req.body.campus_id) {
      res.status(401).json({
        message: '건물을 다시 선택해주세요'
      })
    } else if (req.body.rsv_status != null && !info.RSV_STATUS_ARRAY.includes(req.body.rsv_status)) {
      res.status(401).json({
        message: '상태를 다시 선택해주세요'
      })
    } else if (req.body.is_public_holiday != null && req.body.is_public_holiday != 1 && req.body.is_public_holiday != 0) {
      res.status(401).json({
        message: '공휴일 여부를 다시 선택해주세요'
      })
    } else if (req.body.start_date != null && req.body.end_date != null && moment(req.body.end_date, 'YYYY/MM/DD').diff(moment(req.body.start_date, 'YYYY/MM/DD'), 'days') < 0) {
      res.status(401).json({
        message: '시작 종료일을 다시 선택해주세요'
      })
    } else if (req.body.date != null && !moment(req.body.date).isValid()) {
      res.status(401).json({
        message: '날짜를 다시 선택해주세요'
      })
    } else if (req.body.day_of_the_week != null && req.body.day_of_the_week < 0 && req.body.day_of_the_week > 6) {
      res.status(401).json({
        message: '요일을 다시 선택해주세요'
      })
    } else {
      next();
    }
  },
  checkRequireJoin: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'is_student',
      'email',
      'email_password',
      'password',
      'campus_id',
      'building_id',
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
  checkRequireUpdateStudyGroup: (req, res, next) => {
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
      'title',
      'room_id',
      'date',
      'time_id_list',
      'department_id',
      'representative_name',
      'representative_phone',
      'representative_student_number',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireInsertRoomRsvAdmin: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'rsv_status',
      'title',
      'date',
      'room_id_list',
      'time_list',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireUpdateRoomRsv: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'room_rsv_category_id',
      'title',
      'time_list',
      'room_id_list',
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
  checkRequireEmailPassword: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'email',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequirtUpdateUser: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'campus_id',
      'building_id',
      'name',
      'is_student',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireUpdatePassword: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'old_password',
      'password',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireUpdateUserType: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'user_type',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireHoliday: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'start_date',
      'end_date',
      'name',
      'is_public_holiday',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
  checkRequireAvailableTime: (req, res, next) => {
    let flag = checkRequire(req.body, [
      'available_time_list',
      'day_of_the_week',
    ]);
    if (flag) {
      res.status(401).json({
        message: "필수값을 입력해주세요: " + flag,
      })
    } else {
      next();
    }
  },
}

module.exports = self;