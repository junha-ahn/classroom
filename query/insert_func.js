const squel = require('squel');

const db_func = require('../global/db_func.js');

let self = {
  insertUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          user_type,
          email,
          hashed_password,
          name,
          phone_number,
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
        if (name) {
          let personString = squel.insert()
            .into('person')
            .set('user_id', user_id)
            .set('name', name)
            .set('phone_number', phone_number)
            .toParam();
          await db_func.sendQueryInTransaction(connection, personString);
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