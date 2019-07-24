const squel = require('squel');

const db_func = require('../global/db_func.js');

let self = {
  user: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          user_id,
          email,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'user_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
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
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('user')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('email = ?', email)))
            .order(`user.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          user_id,
          campus_id,
          building_id,
          email,
          user_type,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'user_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
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
            .where(squel.case()
              .when('? IS NULL', user_type)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_type = ?', user_type)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('person.campus_id = ?', campus_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('person.building_id = ?', building_id)))
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
            .where(squel.case()
              .when('? IS NULL', user_type)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_type = ?', user_type)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('person.campus_id = ?', campus_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('person.building_id = ?', building_id)))
            .order(`user.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
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
            .where(squel.case()
              .when('? IS NULL', user_type)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_type = ?', user_type)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('person.campus_id = ?', campus_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('person.building_id = ?', building_id)))
            .order(`user.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  studyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          study_group_id,
          department_id,
          building_id,
          user_id,
          is_mine,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'study_group_id';
        sort_type = (sort_type == false) ? false : true;
        is_mine = is_mine || 0;
        if (page && page_length) {
          countString = squel.select()
            .from('study_group')
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.building_id = ?', building_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.user_id = ?', user_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('study_group')
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.building_id = ?', building_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.user_id = ?', user_id)))
            .field('study_group.*')
            .order(`study_group.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('study_group')
            .left_join('study_group_user', null, `study_group_user.study_group_id = study_group.study_group_id AND study_group_user.user_id = ${user_id}`)
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.building_id = ?', building_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.user_id = ?', user_id)))
            .field('study_group.*')
            .order(`study_group.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vStudyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          study_group_id,
          department_id,
          building_id,
          user_id,
          is_mine,
          is_join,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        is_mine = is_mine || 0;
        is_join = is_join || 0;
        sort_key = (sort_key) ? sort_key : 'study_group_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('study_group')
            .left_join('study_group_user', null, `study_group_user.study_group_id = study_group.study_group_id AND study_group_user.user_id = ${user_id}`)
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.building_id = ?', building_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.user_id = ?', user_id)))
            .where(squel.case()
              .when('? != 1', is_join)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group_user.user_id IS NOT NULL')))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('study_group')
            .join('user', null, 'user.user_id = study_group.user_id')
            .join('person', null, 'person.user_id = user.user_id')
            .left_join('study_group_user', null, `study_group_user.study_group_id = study_group.study_group_id AND study_group_user.user_id = ${user_id}`)
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.building_id = ?', building_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.user_id = ?', user_id)))
            .where(squel.case()
              .when('? != 1', is_join)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group_user.user_id IS NOT NULL')))
            .field('study_group.*')
            .field(squel.case()
              .when('study_group.user_id = ?', user_id)
              .then('1').else('0'), 'is_mine')
            .field('IF(study_group_user.user_id IS NOT NULL, 1 ,0)', 'is_join')
            .field('person.name', 'representative_name')
            .order(`study_group.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('study_group')
            .join('user', null, 'user.user_id = study_group.user_id')
            .join('person', null, 'person.user_id = user.user_id')
            .left_join('study_group_user', null, `study_group_user.study_group_id = study_group.study_group_id AND study_group_user.user_id = ${user_id}`)
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.building_id = ?', building_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group.user_id = ?', user_id)))
            .where(squel.case()
              .when('? != 1', is_join)
              .then(squel.expr().and('study_group.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group_user.user_id IS NOT NULL')))
            .field('study_group.*')
            .field(squel.case()
              .when('study_group.user_id = ?', user_id)
              .then('1').else('0'), 'is_mine')
            .field('IF(study_group_user.user_id IS NOT NULL, 1 ,0)', 'is_join')
            .field('person.name', 'representative_name')
            .order(`study_group.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vStudyGroupPerson: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          study_group_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'study_group_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('study_group_user')
            .join('user', null, 'user.user_id = study_group_user.user_id')
            .join('person', null, 'person.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group_user.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group_user.study_group_id = ?', study_group_id)))
            .field('person.*')
            .group('person.person_id')
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('study_group_user')
            .join('user', null, 'user.user_id = study_group_user.user_id')
            .join('person', null, 'person.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group_user.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group_user.study_group_id = ?', study_group_id)))
            .field('person.*')
            .field('study_group_user.date_joined')
            .order(`study_group_user.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('study_group_user')
            .join('user', null, 'user.user_id = study_group_user.user_id')
            .join('person', null, 'person.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('study_group_user.study_group_id IS NOT NULL'))
              .else(squel.expr().and('study_group_user.study_group_id = ?', study_group_id)))
            .field('study_group_user.date_joined')
            .field('person.*')
            .order(`study_group_user.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  department: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          department_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'department_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('department')
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('department.department_id IS NOT NULL'))
              .else(squel.expr().and('department.department_id = ?', department_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('department')
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('department.department_id IS NOT NULL'))
              .else(squel.expr().and('department.department_id = ?', department_id)))
            .order(`department.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('department')
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('department.department_id IS NOT NULL'))
              .else(squel.expr().and('department.department_id = ?', department_id)))
            .order(`department.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  campus: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          campus_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'campus_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
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
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('campus')
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('campus.campus_id IS NOT NULL'))
              .else(squel.expr().and('campus.campus_id = ?', campus_id)))
            .order(`campus.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  building: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          building_id,
          campus_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'building_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('building')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('building.building_id IS NOT NULL'))
              .else(squel.expr().and('building.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('building.building_id IS NOT NULL'))
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
              .then(squel.expr().and('building.building_id IS NOT NULL'))
              .else(squel.expr().and('building.campus_id = ?', campus_id)))
            .order(`building.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('building')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('building.building_id IS NOT NULL'))
              .else(squel.expr().and('building.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', campus_id)
              .then(squel.expr().and('building.building_id IS NOT NULL'))
              .else(squel.expr().and('building.campus_id = ?', campus_id)))
            .order(`building.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  room: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString;
        let {
          isTransaction,
          room_id,
          building_id,
          floor,
          room_category_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'room_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('room')
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_category_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.room_category_id = ?', room_category_id)))
            .where(squel.case()
              .when('? IS NULL', floor)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.floor = ?', floor)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('room')
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_category_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.room_category_id = ?', room_category_id)))
            .where(squel.case()
              .when('? IS NULL', floor)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.floor = ?', floor)))
            .order(`room.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room')
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_category_id)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.room_category_id = ?', room_category_id)))
            .where(squel.case()
              .when('? IS NULL', floor)
              .then(squel.expr().and('room.room_id IS NOT NULL'))
              .else(squel.expr().and('room.floor = ?', floor)))
            .order(`room.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  holiday: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          holiday_id,
          building_id,
          room_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'holiday_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('holiday')
            .where(squel.case()
              .when('? IS NULL', holiday_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.holiday_id = ?', holiday_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.room_id = ?', room_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('holiday')
            .where(squel.case()
              .when('? IS NULL', holiday_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.holiday_id = ?', holiday_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.room_id = ?', room_id)))
            .order(`holiday.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('holiday')
            .where(squel.case()
              .when('? IS NULL', holiday_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.holiday_id = ?', holiday_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.room_id = ?', room_id)))
            .order(`holiday.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRoomHoliday: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          holiday_id,
          building_id,
          room_id,
          year,
          month,
          date,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        year = year ? parseInt(year) : null;
        month = month ? parseInt(month) : null;
        sort_key = (sort_key) ? sort_key : 'holiday_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('holiday')
            .where(squel.case()
              .when('? IS NULL', holiday_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.holiday_id = ?', holiday_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', date)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.start_date <= ? AND holiday.end_date >= ?', date, date)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('holiday.room_id IS NULL'))
              .else(squel.expr().and('holiday.room_id = ? OR holiday.room_id IS NULL', room_id)))
            .where(squel.case()
              .when('? IS NULL OR ? IS NULL', year, month)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and(`( YEAR(holiday.start_date) = ${year} AND MONTH(holiday.start_date) = ${month} ) 
                OR ( YEAR(holiday.end_date) = ${year} AND MONTH(holiday.end_date) = ${month} )`)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('holiday')
            .where(squel.case()
              .when('? IS NULL', holiday_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.holiday_id = ?', holiday_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', date)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.start_date <= ? AND holiday.end_date >= ?', date, date)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('holiday.room_id IS NULL'))
              .else(squel.expr().and('holiday.room_id = ? OR holiday.room_id IS NULL', room_id)))
            .where(squel.case()
              .when('? IS NULL OR ? IS NULL', year, month)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and(`( YEAR(holiday.start_date) = ${year} AND MONTH(holiday.start_date) = ${month} ) 
                OR ( YEAR(holiday.end_date) = ${year} AND MONTH(holiday.end_date) = ${month} )`)))
            .order(`holiday.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('holiday')
            .where(squel.case()
              .when('? IS NULL', holiday_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.holiday_id = ?', holiday_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', date)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and('holiday.start_date <= ? AND holiday.end_date >= ?', date, date)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('holiday.room_id IS NULL'))
              .else(squel.expr().and('holiday.room_id = ? OR holiday.room_id IS NULL', room_id)))
            .where(squel.case()
              .when('? IS NULL OR ? IS NULL', year, month)
              .then(squel.expr().and('holiday.holiday_id IS NOT NULL'))
              .else(squel.expr().and(`( YEAR(holiday.start_date) = ${year} AND MONTH(holiday.start_date) = ${month} ) 
                OR ( YEAR(holiday.end_date) = ${year} AND MONTH(holiday.end_date) = ${month} )`)))
            .order(`holiday.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  available_time: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          available_time_id,
          building_id,
          room_id,
          day_of_the_week,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'available_time_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('available_time')
            .where(squel.case()
              .when('? IS NULL', available_time_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.available_time_id = ?', available_time_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', day_of_the_week)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.day_of_the_week = ?', day_of_the_week)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('available_time')
            .where(squel.case()
              .when('? IS NULL', available_time_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.available_time_id = ?', available_time_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .where(squel.case()
                .when('? IS NULL', day_of_the_week)
                .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
                .else(squel.expr().and('available_time.day_of_the_week = ?', day_of_the_week)))
              .else(squel.expr().and('available_time.room_id = ?', room_id)))
            .order(`available_time.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('available_time')
            .where(squel.case()
              .when('? IS NULL', available_time_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.available_time_id = ?', available_time_id)))
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', day_of_the_week)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.day_of_the_week = ?', day_of_the_week)))
            .order(`available_time.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRoomAvailableTime: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          building_id,
          room_id,
          time_id_array,
          day_of_the_week,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'available_time_id';
        sort_type = (sort_type == false) ? false : true;
        let is_search_array = time_id_array && time_id_array[0] ? true : null;
        if (page && page_length) {
          countString = squel.select()
            .from('available_time')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.room_id = ? OR available_time.room_id IS NULL', room_id)))
            .where(squel.case()
              .when('? IS NULL', is_search_array)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.available_time_id IN ?', (is_search_array) ? time_id_array : [0])))
            .where(squel.case()
              .when('? IS NULL', day_of_the_week)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.day_of_the_week = ?', day_of_the_week)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('available_time')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.room_id = ? OR available_time.room_id IS NULL', room_id)))
            .where(squel.case()
              .when('? IS NULL', is_search_array)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.available_time_id IN ?', (is_search_array) ? time_id_array : [0])))
            .where(squel.case()
              .when('? IS NULL', day_of_the_week)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.day_of_the_week = ?', day_of_the_week)))
            .order(`available_time.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('available_time')
            .where(squel.case()
              .when('? IS NULL', building_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.building_id = ?', building_id)))
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.room_id = ? OR available_time.room_id IS NULL', room_id)))
            .where(squel.case()
              .when('? IS NULL', is_search_array)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.available_time_id IN ?', (is_search_array) ? time_id_array : [0])))
            .where(squel.case()
              .when('? IS NULL', day_of_the_week)
              .then(squel.expr().and('available_time.available_time_id IS NOT NULL'))
              .else(squel.expr().and('available_time.day_of_the_week = ?', day_of_the_week)))
            .order(`available_time.${sort_key}`, sort_type)
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  room_rsv: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          room_rsv_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'room_rsv_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('room_rsv')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.room_rsv_id = ?', room_rsv_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('room_rsv')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.room_rsv_id = ?', room_rsv_id)))
            .order(`room_rsv.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room_rsv')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.room_rsv_id = ?', room_rsv_id)))
            .order(`room_rsv.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRsvRoomsRequire: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          isTransaction,
          room_rsv_id,
          is_require_rsv_accept,
          is_require_cancel_accept,
        } = object;

        let queryString = squel.select()
          .from('room_to_use')
          .join('room', null, 'room.room_id = room_to_use.room_id')
          .where(squel.case()
            .when('? IS NULL', room_rsv_id)
            .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
            .else(squel.expr().and('room_to_use.room_rsv_id = ?', room_rsv_id)))
          .where(squel.case()
            .when('? IS NULL', is_require_rsv_accept)
            .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
            .else(squel.expr().and('room.is_require_rsv_accept = ?', is_require_rsv_accept)))
          .where(squel.case()
            .when('? IS NULL', is_require_cancel_accept)
            .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
            .else(squel.expr().and('room.is_require_cancel_accept = ?', is_require_cancel_accept)))
          .toParam();

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        resolve({
          results,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRoomRsv: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          room_id,
          room_id_list,
          rsv_status,
          start_datetime,
          end_datetime,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'room_rsv_id';
        sort_type = (sort_type == false) ? false : true;
        let is_search_array = room_id_list && room_id_list[0] ? true : null;
        if (page && page_length) {
          countString = squel.select()
            .from('room_to_use')
            .join('room_rsv', null, 'room_rsv.room_rsv_id = room_to_use.room_rsv_id')
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', is_search_array)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_id IN ?', room_id_list || [0])))
            .where(squel.case()
              .when('? IS NULL', rsv_status)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.rsv_status = ?', rsv_status)))
            .where(squel.case()
              .when('? IS NULL OR ? IS NULL', start_datetime, end_datetime)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.start_datetime < ? && room_rsv.end_datetime > ?', end_datetime, start_datetime)))
            .field('COUNT(*)', 'list_count')
            .group('room_rsv.room_rsv_id')
            .toParam();
          queryString = squel.select()
            .from('room_to_use')
            .join('room_rsv', null, 'room_rsv.room_rsv_id = room_to_use.room_rsv_id')
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', is_search_array)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_id IN ?', room_id_list || [0])))
            .where(squel.case()
              .when('? IS NULL', rsv_status)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.rsv_status = ?', rsv_status)))
            .where(squel.case()
              .when('? IS NULL OR ? IS NULL', start_datetime, end_datetime)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.start_datetime < ? && room_rsv.end_datetime > ?', end_datetime, start_datetime)))
            .order(`room_rsv.${sort_key}`, sort_type)
            .group('room_rsv.room_rsv_id')
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room_to_use')
            .join('room_rsv', null, 'room_rsv.room_rsv_id = room_to_use.room_rsv_id')
            .where(squel.case()
              .when('? IS NULL', room_id)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_id = ?', room_id)))
            .where(squel.case()
              .when('? IS NULL', is_search_array)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_id IN ?', room_id_list || [0])))
            .where(squel.case()
              .when('? IS NULL', rsv_status)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.rsv_status = ?', rsv_status)))
            .where(squel.case()
              .when('? IS NULL OR ? IS NULL', start_datetime, end_datetime)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.start_datetime < ? && room_rsv.end_datetime > ?', end_datetime, start_datetime)))
            .order(`room_rsv.${sort_key}`, sort_type)
            .group('room_rsv.room_rsv_id')
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRoomRsvSingle: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          room_rsv_id,
          user_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'room_rsv_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('room_rsv')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.room_rsv_id = ?', room_rsv_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('room_rsv')
            .left_join('study_group', null, 'study_group.study_group_id = room_rsv.study_group_id')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.room_rsv_id = ?', room_rsv_id)))
            .field('room_rsv.*')
            .field('study_group.name', 'study_group_name')
            .field(squel.case()
              .when('room_rsv.user_id = ?', user_id)
              .then('1')
              .else('0'), 'is_mine')
            .order(`room_rsv.${sort_key}`, sort_type)
            .group('room_rsv.room_rsv_id')
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room_rsv')
            .left_join('study_group', null, 'study_group.study_group_id = room_rsv.study_group_id')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.room_rsv_id = ?', room_rsv_id)))
            .field('room_rsv.*')
            .field('study_group.name', 'study_group_name')
            .field(squel.case()
              .when('room_rsv.user_id = ?', user_id)
              .then('1')
              .else('0'), 'is_mine')
            .order(`room_rsv.${sort_key}`, sort_type)
            .group('room_rsv.room_rsv_id')
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRoomRsvList: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          department_id,
          study_group_id,
          rsv_status,
          is_mine,
          user_id,
          date,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'room_rsv_id';
        sort_type = (sort_type == false) ? false : true;
        is_mine = is_mine || 0;

        if (page && page_length) {
          countString = squel.select()
            .from('room_rsv')
            .where(squel.case()
              .when('? IS NULL', rsv_status)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.rsv_status = ?', rsv_status)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', date)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('DATE(room_rsv.start_datetime) = DATE(?)', date)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('room_rsv')
            .left_join('study_group', null, 'study_group.study_group_id = room_rsv.study_group_id')
            .where(squel.case()
              .when('? IS NULL', rsv_status)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.rsv_status = ?', rsv_status)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', date)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('DATE(room_rsv.start_datetime) = DATE(?)', date)))
            .field('room_rsv.*')
            .field('study_group.name', 'study_group_name')
            .field(squel.case()
              .when('room_rsv.user_id = ?', user_id)
              .then('1')
              .else('0'), 'is_mine')
            .field(squel.select()
              .from('room_to_use')
              .join('room', null, 'room.room_id = room_to_use.room_id')
              .where('room_to_use.room_rsv_id = room_rsv.room_rsv_id')
              .field(`group_concat(room.name SEPARATOR ',')`), 'rooms_name')
            .order(`room_rsv.${sort_key}`, sort_type)
            .group('room_rsv.room_rsv_id')
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room_rsv')
            .left_join('study_group', null, 'study_group.study_group_id = room_rsv.study_group_id')
            .where(squel.case()
              .when('? IS NULL', rsv_status)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.rsv_status = ?', rsv_status)))
            .where(squel.case()
              .when('? IS NULL', department_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.department_id = ?', department_id)))
            .where(squel.case()
              .when('? IS NULL', study_group_id)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.study_group_id = ?', study_group_id)))
            .where(squel.case()
              .when('? != 1', is_mine)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', date)
              .then(squel.expr().and('room_rsv.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('DATE(room_rsv.start_datetime) = DATE(?)', date)))
            .field('room_rsv.*')
            .field('study_group.name', 'study_group_name')
            .field(squel.case()
              .when('room_rsv.user_id = ?', user_id)
              .then('1')
              .else('0'), 'is_mine')
            .field(squel.select()
              .from('room_to_use')
              .join('room', null, 'room.room_id = room_to_use.room_id')
              .where('room_to_use.room_rsv_id = room_rsv.room_rsv_id')
              .field(`group_concat(room.name SEPARATOR ',')`), 'rooms_name')
            .order(`room_rsv.${sort_key}`, sort_type)
            .group('room_rsv.room_rsv_id')
            .toParam();
        }
        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vRoomToUse: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          room_rsv_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'room_rsv_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('room_to_use')
            .join('room', null, 'room.room_id = room_to_use.room_id')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_rsv_id = ?', room_rsv_id)))
            .field('COUNT(*)', 'list_count')
            .group('room_to_use.room_rsv_id')
            .toParam();
          queryString = squel.select()
            .from('room_to_use')
            .join('room', null, 'room.room_id = room_to_use.room_id')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_rsv_id = ?', room_rsv_id)))
            .order(`room_to_use.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room_to_use')
            .join('room', null, 'room.room_id = room_to_use.room_id')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_to_use.room_rsv_id IS NOT NULL'))
              .else(squel.expr().and('room_to_use.room_rsv_id = ?', room_rsv_id)))
            .order(`room_to_use.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  room_rsv_time: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          room_rsv_id,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;
        sort_key = (sort_key) ? sort_key : 'room_rsv_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('room_rsv_time')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv_time.room_rsv_time_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv_time.room_rsv_id = ?', room_rsv_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('room_rsv_time')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv_time.room_rsv_time_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv_time.room_rsv_id = ?', room_rsv_id)))
            .order(`room_rsv_time.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('room_rsv_time')
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('room_rsv_time.room_rsv_time_id IS NOT NULL'))
              .else(squel.expr().and('room_rsv_time.room_rsv_id = ?', room_rsv_id)))
            .order(`room_rsv_time.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  notification: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          notification_id,
          sender_id,
          receiver_id,
          room_rsv_id,
          is_read,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'notification_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('notification')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', sender_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.sender_id = ?', sender_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.room_rsv_id = ?', room_rsv_id)))
            .where(squel.case()
              .when('? IS NULL', is_read)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.is_read = ?', is_read)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('notification')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', sender_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.sender_id = ?', sender_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.room_rsv_id = ?', room_rsv_id)))
            .where(squel.case()
              .when('? IS NULL', is_read)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.is_read = ?', is_read)))
            .order(`notification.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('notification')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', sender_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.sender_id = ?', sender_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.room_rsv_id = ?', room_rsv_id)))
            .where(squel.case()
              .when('? IS NULL', is_read)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.is_read = ?', is_read)))
            .order(`notification.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
        resolve({
          results,
          list_count
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  vNotificationRsv: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          isTransaction,
          notification_id,
          sender_id,
          receiver_id,
          room_rsv_id,
          is_read,
          page,
          page_length,
          sort_key,
          sort_type
        } = object;

        sort_key = (sort_key) ? sort_key : 'notification_id';
        sort_type = (sort_type == false) ? false : true;

        if (page && page_length) {
          countString = squel.select()
            .from('notification')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', sender_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.sender_id = ?', sender_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.room_rsv_id = ?', room_rsv_id)))
            .where(squel.case()
              .when('? IS NULL', is_read)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.is_read = ?', is_read)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('notification')
            .left_join('room_rsv', null, 'room_rsv.room_rsv_id = notification.room_rsv_id')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', sender_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.sender_id = ?', sender_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.room_rsv_id = ?', room_rsv_id)))
            .where(squel.case()
              .when('? IS NULL', is_read)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.is_read = ?', is_read)))
            .field('notification.*')
            .field('room_rsv.title')
            .order(`notification.${sort_key}`, sort_type)
            .limit(page_length)
            .offset((parseInt(page) - 1) * page_length)
            .toParam();
        } else {
          queryString = squel.select()
            .from('notification')
            .left_join('room_rsv', null, 'room_rsv.room_rsv_id = notification.room_rsv_id')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', sender_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.sender_id = ?', sender_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .where(squel.case()
              .when('? IS NULL', room_rsv_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.room_rsv_id = ?', room_rsv_id)))
            .where(squel.case()
              .when('? IS NULL', is_read)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.is_read = ?', is_read)))
            .field('notification.*')
            .field('room_rsv.title')
            .order(`notification.${sort_key}`, sort_type)
            .toParam();
        }

        let results = await db_func.sendQueryToDB(connection, queryString, isTransaction);
        let list_count = (!countString) ? results.length : (await db_func.sendQueryToDB(connection, countString, isTransaction))[0].list_count;
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