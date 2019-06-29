var express = require('express');
var router = express.Router();

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares');

router.get('/', async (req, res, next) => {
  let connection;
  try {
    connection = await db_func.getDBConnection();
    let campus_results = (await select_func.getCampus(connection, {})).results;
    let {
      results
    } = await select_func.getBuilding(connection, {
      sort_key: 'campus_id',
    });

    res.render('main', {
      campuses : makeCampuses(campus_results, results),
    });
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

function makeCampuses(campus_results, building_rseults) {
  for (let i in building_rseults) {
    for (let j in campus_results) {
      if (building_rseults[i].campus_id == campus_results[j].campus_id) {
        if (!campus_results[j].building_rseults) {
          campus_results[j].building_rseults = [];
        }
        campus_results[j].building_rseults.push(building_rseults[i]);
        break;
      }
    }
  }
  return campus_results;
}
module.exports = router;