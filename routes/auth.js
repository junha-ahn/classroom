const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const {
  isLoggedIn,
  isNotLoggedIn,
  renderIsLoggedIn,
  checkReqInfo,
  checkRequireEmailPassword,
  checkRequireJoin,
  checkRequireUpdatePassword,
} = require('../global/middlewares');

const foo = require('../global/foo');
const db_func = require('../global/db_func');
const redis_func = (process.env.REDIS_ENABLE == 1) ? require('../global/redis_func') : undefined;
const sgMail = require('../global/sgMail');

const passStorage = {};

const {
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
    await setEmailPassword(email, email_password);

    res.status(200).json({
      message: '완료',
    })
  } else {
    res.status(401).json({
      message: '이미 존재하는 이메일 입니다',
    })
  }
}));

router.post('/join', isNotLoggedIn, checkReqInfo, checkRequireJoin, db_func.inDBStream(async (req, res, next, conn) => {
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

  let email_is_unique = (await select_func.user(conn, {
    email
  })).results[0] ? false : true;

  if (email_is_unique) {
    await matchEmailPassword(email, email_password);
    let hashed_password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
    await insert_func.user(conn, {
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
  } else {
    res.status(401).json({
      message: '이미 가입된 이메일 입니다',
    })
  }
}));

router.post('/login', isNotLoggedIn, async (req, res, next) => {
  if (req.body.email == undefined || req.body.password == undefined) {
    res.status(401).json({
      message: "모두 입력해주세요"
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

router.get('/logout', renderIsLoggedIn, async (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


router.get('/me', isLoggedIn, db_func.inDBStream(async (req, res, next, conn) => {
  let {
    results
  } = await select_func.vUser(conn, {
    user_id: req.user.user_id
  });
  if (!results[0]) {
    res.status(403).json({
      message: '다시 로그인 해 주세요'
    })
  } else {
    foo.cleaningList(results);
    res.status(200).json({
      result: results[0],
    })
  }
}));

router.put('/password', isLoggedIn, checkRequireUpdatePassword, db_func.inDBStream(async (req, res, next, conn) => {
  const {
    old_password,
    password,
  } = req.body;
  let {
    results
  } = await select_func.user(conn, {
    user_id: req.user.user_id
  });
  let passwordIsValid = bcrypt.compareSync(`${old_password}`, results[0].password);
  let hashed_password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

  if (!passwordIsValid) {
    res.status(403).json({
      message: "기존 비밀번호를 다시 입력해주세요."
    });
  } else if (bcrypt.compareSync(password, results[0].password)) {
    res.status(401).json({
      message: "기존 비밀번호와 다른 새 비밀번호를 입력해주세요."
    })
  } else {

    let update_result = await update_func.userPassword(conn, {
      user_id: req.user.user_id,
      hashed_password,
    })
    foo.setRes(res, update_result, {
      message: '성공했습니다'
    })
  }
}));


function setEmailPassword(email, email_password) {
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.REDIS_ENABLE == 1) {
        await redis_func.set(email, email_password, 60 * 3);
      } else {
        passStorage[email] = email_password;
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function matchEmailPassword(email, email_password) {
  return new Promise(async (resolve, reject) => {
    try {
      let _email_password = null;
      if (process.env.REDIS_ENABLE == 1) {
        _email_password = await redis_func.get(email);
      } else {
        _email_password = passStorage[email];
      }
      
      if (email_password != _email_password) {
        let error = new Error();
        error.status = 401;
        error.message = _email_password == null ? '다시 이메일 인증 암호를 발급해주세요' : '이메일 인증 암호가 다릅니다.'
        throw error;
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = router;