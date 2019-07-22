const localStorage = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const db_func = require('../global/db_func');
const  {
  select_func,
} = require('../query/index');

module.exports = (passport) => {
  passport.use(new localStorage({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    let connection;
    try {
      connection = await db_func.getDBConnection();
      let {
        results
      } = await select_func.vUser(connection, {
        email,
      });
      if (results[0]) {
        let compare_result = await bcrypt.compare(password, results[0].password);
        if (compare_result) {
          done(null, results[0]);
        } else {
          done(null, false, {
            message: '이메일, 비밀번호를 다시 입력해주세요.'
          });
        }
      } else {
        done(null, false, {
          message: '이메일, 비밀번호를 다시 입력해주세요.'
        });
      }
    } catch (error) {
      done(error);
    } finally { 
      db_func.release(connection);
    }
  }));
};