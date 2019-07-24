/**
 * Test
 * 
 */


const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  studyGroupUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          user_id,
          study_group_id,
        } = object;

        let queryString = squel.delete()
          .from('study_group_user')
          .where('user_id = ?', user_id)
          .where('study_group_id = ?', study_group_id)
          .toParam();
        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
  notification: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          notification_id,
          receiver_id,
        } = object;

        let queryString;
        if (notification_id) {
          queryString = squel.delete()
            .from('notification')
            .where('notification_id = ?', notification_id)
            .where('receiver_id = ?', receiver_id)
            .toParam();
        } else {
          queryString = squel.delete()
            .from('notification')
            .where('receiver_id = ?', receiver_id)
            .toParam();
        }

        resolve(await db_func.sendQueryToDB(connection, queryString, isTransaction));
      } catch (error) {
        reject(error);
      }
    });
  },
}

module.exports = self;