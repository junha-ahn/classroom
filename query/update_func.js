const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  userPassword: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          user_id,
          hashed_password,
        } = object;

        let queryString = squel.update()
          .table('user')
          .set('password', hashed_password)
          .set('date_last_password_changed', squel.str('NOW()'))
          .where('user_id = ?',user_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  userType: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          user_id,
          user_type,
        } = object;

        let queryString = squel.update()
          .table('user')
          .set('user_type', user_type)
          .where('user_id = ?',user_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
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
          person_id,
          user_id,
          campus_id,
          building_id,
          is_student,
          name,
          phone,
          student_number,
        } = object;
        let queryString;
        if (person_id) {
          queryString = squel.update()
            .table('person')
            .set('campus_id', campus_id)
            .set('building_id', building_id)
            .set('is_student', is_student)
            .set('name', name)
            .set('phone', phone)
            .set('student_number', student_number)
            .where('person_id = ?', person_id)
            .toParam();
        } else {
          queryString = squel.update()
            .table('person')
            .set('campus_id', campus_id)
            .set('building_id', building_id)
            .set('is_student', is_student)
            .set('name', name)
            .set('phone', phone)
            .set('student_number', student_number)
            .where('user_id = ?', user_id)
            .toParam();
        }
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  studyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          study_group_id,
          user_id,
          name,
          description,
        } = object;
        let queryString = squel.update()
          .table('study_group')
          .set('name', name)
          .set('description', description)
          .where('study_group_id = ?', study_group_id)
          .where('user_id = ?', user_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  room: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          room_id,
          building_id,
          room_category_id,
          auth_rsv_create,
          auth_rsv_cancel,
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
        let queryString = squel.update()
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
          .where('building_id = ?', building_id)
          .where('room_id = ?', room_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  room_rsv_status: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          room_rsv_id,
          rsv_status,
        } = object;
        let queryString = squel.update()
          .table('room_rsv')
          .set('rsv_status', rsv_status)
          .set('date_last_updated', squel.str('NOW()'))
          .where('room_rsv_id = ?', room_rsv_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  holiday: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          holiday_id,
          building_id,
          start_date,
          end_date,
          name,
          is_public_holiday,
        } = object;

        let queryString = squel.update()
          .table('holiday')
          .set('start_date', start_date)
          .set('end_date', end_date)
          .set('name', name)
          .set('is_public_holiday', is_public_holiday)
          .where('building_id = ?',building_id)
          .where('holiday_id = ?',holiday_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString));
      } catch (error) {
        reject(error);
      }
    });
  },
  notificationCount: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          notification_id,
        } = object;
        let queryString = squel.update()
          .table('notification')
          .set('notification_count = notification_count + 1')
          .set('date_last_updated', squel.str('NOW()'))
          .where('notification_id = ?', notification_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  notificationRead: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          notification_id,
          receiver_id,
        } = object;
        let queryString;
        if (notification_id) {
          queryString = squel.update()
            .table('notification')
            .set('is_read = 1')
            .where('notification_id = ?', notification_id)
            .where('receiver_id = ?', receiver_id)
            .toParam();
        } else {
          queryString = squel.update()
            .table('notification')
            .set('is_read = 1')
            .where('receiver_id = ?', receiver_id)
            .toParam();
        }
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  room_rsv: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          room_rsv_id,
          start_datetime,
          end_datetime,
          room_rsv_category_id,
          department_id,
          study_group_id,
          title,
          student_count,
          non_student_count,
          representative_name,
          representative_phone,
          description,
        } = object;

        let queryString = squel.update()
          .table('room_rsv')
          .set('start_datetime', start_datetime)
          .set('end_datetime', end_datetime)
          .set('room_rsv_category_id', room_rsv_category_id)
          .set('department_id', department_id)
          .set('study_group_id', study_group_id)
          .set('title', title)
          .set('student_count', student_count)
          .set('non_student_count', non_student_count)
          .set('representative_name', representative_name)
          .set('representative_phone', representative_phone)
          .set('description', description)
          .set('date_last_updated', squel.str('NOW()'))
          .where('room_rsv_id = ?', room_rsv_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
}

module.exports = self;