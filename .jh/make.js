(async () => {
  const fs = require('fs');
  let connection = await db_func.getDBConnection();
  let campus_results = (await select_func.getCampus(connection, {})).results;
  let {
    results
  } = await select_func.getBuilding(connection, {
    sort_key: 'campus_id',
  });

  let campuses = makeCampuses(campus_results, results)

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
  db_func.release(connection);

  let writeData = {
    campus_results,
    building_results : results,
    campuses,
  };
  fs.writeFile('base_data.js', JSON.stringify(writeData), 'utf8', function (error) {
    console.log('write end');
  });
})();
