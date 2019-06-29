const squel = require('squel');

const db_func = require('../global/db_func.js');

let self = {
  getUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          user_id,
          email,
          page_num,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'user_id';
        sort_type = (sort_type == false) ? false : true;

        if (page_num && page_length) {
          countString = squel.select()
            .from('user')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('user')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page_num) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('user')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user_id IS NOT NULL'))
              .else(squel.expr().and('user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user_id IS NOT NULL'))
              .else(squel.expr().and('email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getViewTableUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          user_id,
          email,
          page_num,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'user_id';
        sort_type = (sort_type == false) ? false : true;

        if (page_num && page_length) {
          countString = squel.select()
            .from('user')
            .left_join('person', null, 'person.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('user')
            .left_join('person', null, 'person.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page_num) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('user')
            .left_join('person', null, 'person.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user_id IS NOT NULL'))
              .else(squel.expr().and('user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user_id IS NOT NULL'))
              .else(squel.expr().and('email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getViewTableAdmin: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          user_id,
          email,
          page_num,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'user_id';
        sort_type = (sort_type == false) ? false : true;

        if (page_num && page_length) {
          countString = squel.select()
            .from('user')
            .left_join('user_authority', null, 'user_authority.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('user')
            .left_join('user_authority', null, 'user_authority.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page_num) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('user')
            .left_join('user_authority', null, 'user_authority.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user_id IS NOT NULL'))
              .else(squel.expr().and('user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user_id IS NOT NULL'))
              .else(squel.expr().and('email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getCampus: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          campus_id,
          page_num,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'campus_id';
        sort_type = (sort_type == false) ? false : true;

        if (page_num && page_length) {
          countString = squel.select()
            .from('campus')
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('campus.campus_id IS NOT NULL'))
              .else(squel.expr().and('campus.campus_id = ?', campus_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('campus')
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('campus.campus_id IS NOT NULL'))
              .else(squel.expr().and('campus.campus_id = ?', campus_id)))
            .order(`campus.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page_num) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('campus')
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('campus_id IS NOT NULL'))
              .else(squel.expr().and('campus_id = ?', campus_id)))
            .order(`campus.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getBuilding: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          building_id,
          campus_id,
          page_num,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'building_id';
        sort_type = (sort_type == false) ? false : true;

        if (page_num && page_length) {
          countString = squel.select()
            .from('building')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('building.building_id IS NOT NULL'))
              .else(squel.expr().and('building.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('building.campus_id IS NOT NULL'))
              .else(squel.expr().and('building.campus_id = ?', campus_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('building')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('building.building_id IS NOT NULL'))
              .else(squel.expr().and('building.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('building.campus_id IS NOT NULL'))
              .else(squel.expr().and('building.campus_id = ?', campus_id)))
            .order(`building.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page_num) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('building')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('building_id IS NOT NULL'))
              .else(squel.expr().and('building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('building.campus_id IS NOT NULL'))
              .else(squel.expr().and('building.campus_id = ?', campus_id)))
            .order(`building.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
}

module.exports = self;