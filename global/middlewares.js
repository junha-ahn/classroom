const constant = require('./constant')

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: '로그인이 필요합니다'
    })
  }
}
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.user_type == constant.ADMIN_TYPE) {
      next()
    } else {
      res.status(403).json({
        message: '관리자 접근 권한입니다'
      })
    }
  } else {
    res.status(403).json({
      message: '로그인이 필요합니다'
    })
  }
}
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: '로그아웃이 필요합니다'
    })
  }
}