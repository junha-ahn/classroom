(async () => {
  require('dotenv').config();
  const squel = require('squel');
  const fs = require('fs');
  const path = require('path');

  const db_func = require('./db_func');

  let connection;
  try {
    connection = await db_func.getDBConnection();
    let campus_results = await db_func.sendQueryToDB(connection,
      (squel.select()
        .from('campus')
        .toParam()))
    let building_results = await db_func.sendQueryToDB(connection,
      (squel.select()
        .from('building')
        .toParam()))
    let department_results = await db_func.sendQueryToDB(connection,
      (squel.select()
        .from('department')
        .toParam()))
    let room_category_results = await db_func.sendQueryToDB(connection,
      (squel.select()
        .from('room_category')
        .toParam()))
    let room_rsv_category_results = await db_func.sendQueryToDB(connection,
      (squel.select()
        .from('room_rsv_category')
        .toParam()))
        
    let data = {
      campus_results,
      building_results,
      department_results,
      room_category_results,
      room_rsv_category_results,
    };
    
    fs.writeFile(path.join('./global/db_data.json'), JSON.stringify(data), function(err) {
      if (err) throw err;
        process.exit(0)
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(1)
  } finally {
    db_func.release(connection);
  }
})();