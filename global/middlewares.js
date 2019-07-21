const info = require('./info')
const foo = require('./foo')

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
    } else {
      next();
    }
  },
}

module.exports = self;