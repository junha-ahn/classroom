const squel = require('squel');

const db_func = require('../global/db_func.js');
const constant = require('../global/constant.js');

let self = {
  person: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_id,
          campus_id,
          building_id,
          name,
          phone,
          student_number,
        } = object;
        let personString = squel.update()
          .table('person')
          .set('campus_id', campus_id)
          .set('building_id', building_id)
          .set('name', name)
          .set('phone', phone)
          .set('student_number', student_number)
          .where('user_id = ?', user_id)
          .toParam();
        await db_func.sendQueryToDB(connection, personString);
        resolve();
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
}

module.exports = self;