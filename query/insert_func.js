const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  user: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_type,
          email,
          hashed_password,
          campus_id,
          building_id,
          department_id,
          name,
          phone,
          student_number,
        } = object;

        user_type = 10;
        await db_func.beginTransaction(connection);
        let userString = squel.insert()
          .into('user')
          .set('user_type', user_type)
          .set('email', email)
          .set('password', hashed_password)
          .toParam();
        let insert_result = await db_func.sendQueryToDB(connection, userString, true);
        let user_id = insert_result.insertId;
        await self.person(connection, {
          isTransaction: true,
          user_id,
          campus_id,
          building_id,
          department_id,
          name,
          phone,
          student_number,
        })

        if (constant.ADMIN_TYPE == user_type) {
          let userAuthorityString = squel.insert()
            .into('user_authority')
            .set('user_id', user_id)
            .set('can_manage_user', 0)
            .set('can_manage_person', 0)
            .set('can_manage_room', 0)
            .set('can_manage_usgae', 0)
            .toParam();
          await db_func.sendQueryToDB(connection, userAuthorityString, true);
        }

        await db_func.commit(connection);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  person: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          user_id,
          campus_id,
          building_id,
          department_id,
          name,
          phone,
          student_number,
        } = object;
        let personString = squel.insert()
          .into('person')
          .set('user_id', user_id)
          .set('campus_id', campus_id)
          .set('building_id', building_id)
          .set('department_id', department_id)
          .set('name', name)
          .set('phone', phone)
          .set('student_number', student_number)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, personString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  studyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_id,
          department_id,
          building_id,
          name,
          description,
        } = object;
        let studyGroupString = squel.insert()
          .into('study_group')
          .set('department_id', department_id)
          .set('building_id', building_id)
          .set('name', name)
          .set('description', description)
          .set('user_id', user_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, studyGroupString));
      } catch (error) {
        reject(error);
      }
    });
  },
  studyGroupUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_id,
          study_group_id,
        } = object;

        let userString = squel.insert()
          .into('study_group_user')
          .set('user_id', user_id)
          .set('study_group_id', study_group_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, userString, true));
      } catch (error) {
        reject(error);
      }
    });
  },
  room: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          building_id,
          room_category_id,
          auth_rsv_create,
          name,
          room_number,
          floor,
          seat_count,
          description,
          is_require_rsv_accept,
          is_require_cancel_accept,
          rsv_apply_min_day,
          rsv_cancel_min_day,
        } = object;
        let roomString = squel.insert()
          .into('room')
          .set('building_id', building_id)
          .set('room_category_id', room_category_id)
          .set('auth_rsv_create', auth_rsv_create)
          .set('auth_rsv_cancel', auth_rsv_cancel)
          .set('name', name)
          .set('room_number', room_number)
          .set('floor', floor)
          .set('seat_count', seat_count)
          .set('description', description)
          .set('is_require_rsv_accept', is_require_rsv_accept)
          .set('is_require_cancel_accept', is_require_cancel_accept)
          .set('rsv_apply_min_day', rsv_apply_min_day)
          .set('rsv_cancel_min_day', rsv_cancel_min_day)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, roomString));
      } catch (error) {
        reject(error);
      }
    });
  },
}

module.exports = self;