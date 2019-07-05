const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');

const select_func = require('../query/select_func');
const insert_func = require('../query/insert_func');
const delete_func = require('../query/delete_func');

const foo = require('../global/foo');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('../global/middlewares');

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

router.post('/study_group/join/:study_group_id', isLoggedIn, async (req, res, next) => {
  let study_group_id = req.params.study_group_id;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.getStudyGroup(connection, {
      study_group_id,
      user_id : req.user.user_id,
    })
    if (!results[0]) {
      res.status(401).json({
        message: '그룹을 다시 선택해주세요'
      })
    } else if (results[0].is_join) {
      res.status(401).json({
        message: '이미 가입한 그룹입니다'
      })
    } else {
      let insert_result = await insert_func.insertStudyGroupUser(connection, {
        study_group_id,
        user_id : req.user.user_id,
      })
      foo.setRes(res, insert_result, {
        message : '성공했습니다'
      })
    }
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});

router.delete('/study_group/join/:study_group_id', isLoggedIn, async (req, res, next) => {
  let study_group_id = req.params.study_group_id;

  let connection;
  try {
    connection = await db_func.getDBConnection();

    let delete_result = await delete_func.deleteStudyGroupUser(connection, {
      study_group_id,
      user_id : req.user.user_id,
    })
    foo.setRes(res, delete_result, {
      message : '성공했습니다'
    })
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