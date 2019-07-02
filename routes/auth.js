const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares');

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');
const insert_func = require('../query/insert_func');

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const {
    email,
    password,
    name,
    phone,
  } = req.body;
  let connection;
  try {
    connection = await db_func.getDBConnection();
    let email_is_unique = (await select_func.getUser(connection, {
      email
    })).results[0] ? false : true;
    if (email_is_unique) {
      let hashed_password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
      await insert_func.insertUser(connection, {
        email,
        hashed_password,
        name,
        phone,
      });
      res.status(200).json({
        message: '가입 성공',
      })
    } else {
      res.status(401).json({
        message: '이미 가입된 이메일 입니다',
      })
    }
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
  if (req.body.email == undefined || req.body.password == undefined) {
    res.status(401).json({
      message : "모두 입력해주세요"
    })
  } else {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        return next(authError);
      }
      if (!user) {
        return res.status(401).json(info);
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          return next(loginError);
        }
        return res.status(200).json({
          message: '로그인 성공',
        })
      });
    })(req, res, next);
  }
});

router.get('/logout', isLoggedIn, async (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({
    message: '로그아웃 성공',
  })
});

module.exports = router;