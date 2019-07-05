const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

const foo = require('../global/foo');

router.get('/room', async (req, res, next) => {
  const {
    building_id,
    sort_by_floor
  } = req.query;
  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.getRoom(connection, {
      building_id,
      sort_key: 'room_number',
    });
    res.status(200).json({
      results : sort_by_floor ? roomSortByFloor(results) : results,
      list_count,
    })
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.get('/group', async (req, res, next) => {
  const {
    page,
    page_length,
    department_id,
    building_id,
  } = req.query;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.getStudyGroup(connection, {
      page,
      page_length,
      department_id,
      building_id,
    })

    foo.cleaningList(results);

    res.status(200, foo.getResJson(req.user, {
      results,
      list_count,
      query: req.query,
    }));
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

function roomSortByFloor(room_results) {
  let rooms = {};
  for (let i in room_results) {
    if (!rooms[room_results[i].floor]) {
      rooms[room_results[i].floor] = []
    }
    rooms[room_results[i].floor].push(room_results[i]);
  }
  return rooms;
}

module.exports = router;