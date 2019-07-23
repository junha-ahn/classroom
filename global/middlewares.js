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
}

module.exports = self;