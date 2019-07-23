const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  person: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          person_id,
          campus_id,
          building_id,
          is_student,
          name,
          phone,
          student_number,
        } = object;
        let personString = squel.update()
          .table('person')
          .set('campus_id', campus_id)
          .set('building_id', building_id)
          .set('is_student', is_student)
          .set('name', name)
          .set('phone', phone)
          .set('student_number', student_number)
          .where('person_id = ?', person_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, personString));
      } catch (error) {
        reject(error);
      }
    });
  },
  studyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          study_group_id,
          user_id,
          name,
          description,
        } = object;
        let studyGroupString = squel.update()
          .table('study_group')
          .set('name', name)
          .set('description', description)
          .where('study_group_id = ?', study_group_id)
          .where('user_id = ?', user_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, studyGroupString));
      } catch (error) {
        reject(error);
      }
    });
  },
  room: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          room_id,
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
        let roomString = squel.update()
          .table('room')
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
          .where('room_id = ?', room_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, roomString));
      } catch (error) {
        reject(error);
      }
    });
  },
  room_rsv_status: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          room_rsv_id,
          rsv_status,
        } = object;
        let roomString = squel.update()
          .table('room_rsv')
          .set('rsv_status', rsv_status)
          .where('room_rsv_id = ?', room_rsv_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, roomString));
      } catch (error) {
        reject(error);
      }
    });
  },
}

module.exports = self;