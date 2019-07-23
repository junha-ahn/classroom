const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const {
  isLoggedIn,
  isNotLoggedIn,
  checkReqInfo,
  checkRequireEmailPassword,
} = require('../global/middlewares');

const foo = require('../global/foo');
const db_func = require('../global/db_func');
const redis_func = (process.env.REDIS_ENABLE == 1) ? require('../global/redis_func') : undefined;
const sgMail = require('../global/sgMail');


const  {
  select_func,
  update_func,
  insert_func,
  delete_func,
} = require('../query/index');

router.post('/email/password', isNotLoggedIn, checkRequireEmailPassword, db_func.inDBStream(async (req, res, next, conn) => {
  const {
    email,
  } = req.body;
  let email_is_unique = (await select_func.user(conn, {
    email
  })).results[0] ? false : true;
  if (email_is_unique) {
    let email_password = foo.makeRandomPassword();
    let msg = {
      to: email,
      from: 'junha.ahn.dev@gmail.com',
      subject: '이메일 인증 암호',
      html: `발급된 이메일 인증 암호를 3분안에 입력해주세요.<br/><strong>${email_password}</strong>`,
    };
    await sgMail.send(msg);
    await redis_func.set(email, email_password, 60 * 3);
    res.status(200).json({
      message: '완료',
    })
  } else {
    res.status(401).json({
      message: '이미 존재하는 이메일 입니다',
    })
  }
}));

router.post('/join', isNotLoggedIn, checkReqInfo, async (req, res, next) => {
  const {
    is_student,
    email,
    email_password,
    password,
    campus_id,
    building_id,
    department_id,
    name,
    phone,
    student_number,
  } = req.body;
  let connection;
  try {
    connection = await db_func.getDBConnection();
    let email_is_unique = (await select_func.user(connection, {
      email
    })).results[0] ? false : true;
    if (email_is_unique) {
      let _email_password = await redis_func.get(email);
      if (email_password != _email_password) {
        res.status(401).json({
          message: _email_password == null ? 
          '다시 이메일 인증 암호를 발급해주세요'
          : '이메일 인증 암호가 다릅니다.'
        })
      } else {
        let hashed_password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
        await insert_func.user(connection, {
          is_student,
          email,
          hashed_password,
          campus_id,
          building_id,
          department_id,
          name,
          phone,
          student_number,
        });
        res.status(200).json({
          message: '가입 성공',
        })
      }
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
  res.redirect('/');
});

module.exports = router;