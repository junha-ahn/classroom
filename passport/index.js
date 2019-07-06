const local = require('./localStrategy');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, {
      user_id: user.user_id,
      user_type : user.user_type,
      campus_id : user.campus_id,
      building_id : user.building_id,
      department_id : user.department_id,
    })
  });
  passport.deserializeUser(async (user, done) => {
    done(null, user);
  })
  local(passport);
};