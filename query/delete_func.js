const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  studyGroupUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_id,
          study_group_id,
        } = object;

        let userString = squel.delete()
          .from('study_group_user')
          .where('user_id = ?',user_id)
          .where('study_group_id = ?', study_group_id)
          .toParam();
        let delete_result = await db_func.sendQueryToDB(connection, userString, true);
        resolve(delete_result);
      } catch (error) {
        reject(error);
      }
    });
  },
}

module.exports = self;