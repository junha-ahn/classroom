const squel = require('squel');
// squel  ORM 같은거 ?? 

const db_func = require('../global/db_func.js');

let self = {
  user: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  viewTableUser: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  viewTableAdmin: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          user_id,
          user_type,
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
            .left_join('user_authority', null, 'user_authority.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', user_type)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_type = ?', user_type)))
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
              .when('? IS NULL', user_type)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_type = ?', user_type)))
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
            .left_join('user_authority', null, 'user_authority.user_id = user.user_id')
            .where(squel.case()
              .when('? IS NULL', user_id)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_id = ?', user_id)))
            .where(squel.case()
              .when('? IS NULL', user_type)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.user_type = ?', user_type)))
            .where(squel.case()
              .when('? IS NULL', email)
              .then(squel.expr().and('user.user_id IS NOT NULL'))
              .else(squel.expr().and('user.email = ?', email)))
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
  studyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  viewTableStudyGroup: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  viewTableStudyGroupPerson: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  department: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  campus: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  building: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  room: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          room_id,
          building_id,
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
            .order(`room.${sort_key}`, sort_type)
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
  holiday: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
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
  notification: (connection, object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryString;
        let countString
        let {
          notification_id,
          receiver_id,
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
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.receiver_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .field('COUNT(*)', 'list_count')
            .toParam();
          queryString = squel.select()
            .from('notification')
            .where(squel.case()
              .when('? IS NULL', notification_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.notification_id = ?', notification_id)))
            .where(squel.case()
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
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
              .when('? IS NULL', receiver_id)
              .then(squel.expr().and('notification.notification_id IS NOT NULL'))
              .else(squel.expr().and('notification.receiver_id = ?', receiver_id)))
            .order(`notification.${sort_key}`, sort_type)
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