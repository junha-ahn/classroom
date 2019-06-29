const local = require('./localStrategy');

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  });
  passport.deserializeUser(async (user_id, done) => {
    let connection;
    try {
      connection = await db_func.getDBConnection();
      let {
        results
      } = await select_func.getUser(connection, {
        user_id,
      });
      if (results[0]) {
        done(null, results[0]);
      } else {
        done(null);
      }
    } catch (error) {
      done(error);
    } finally {
      db_func.release(connection);
    }
  })
  local(passport);
};