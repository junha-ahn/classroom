const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  insertUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_type,
          email,
          hashed_password,
          campus_id,
          building_id,
          name,
          phone_number,
          student_number,
        } = object;
        user_type = 10
        await db_func.beginTransaction(connection);
        let userString = squel.insert()
          .into('user')
          .set('user_type',user_type)
          .set('email', email)
          .set('password', hashed_password)
          .toParam();
        let insert_result = await db_func.sendQueryInTransaction(connection, userString);
        let user_id = insert_result.insertId;
        let personString = squel.insert()
          .into('person')
          .set('user_id', user_id)
          .set('campus_id', campus_id)
          .set('building_id', building_id)
          .set('name', name)
          .set('phone_number', phone_number)
          .set('student_number', student_number)
          .toParam();
        await db_func.sendQueryInTransaction(connection, personString);
        if (constant.ADMIN_TYPE == user_type) {
          let userAuthorityString = squel.insert()
            .into('user_authority')
            .set('user_id', user_id)
            .set('can_manage_user', 0)
            .set('can_manage_person', 0)
            .set('can_manage_room', 0)
            .set('can_manage_usgae', 0)
            .toParam();
          await db_func.sendQueryInTransaction(connection, userAuthorityString);
        }
        await db_func.commit(connection);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = self;