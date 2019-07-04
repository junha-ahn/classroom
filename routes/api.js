const express = require('express');
const router = express.Router();

const db_func = require('../global/db_func');
const select_func = require('../query/select_func');

router.get('/room', async (req, res, next) => {
  const {
    building_id,
  } = req.body;

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let {
      results,
      list_count,
    } = await select_func.getRoom(connection, {
      building_id,
    });
    res.status(200).json({
      results,
      list_count,
    })
  } catch (error) {
    next(error);
  } finally {
    db_func.release(connection);
  }
});


module.exports = router;