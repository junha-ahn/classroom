module.exports = () => {
  let global_data = require('../global/data');
  let campus_results = global_data.campus_results;
  let building_results = global_data.building_results;
  for (let i in building_results) {
    for (let j in campus_results) {
      if (building_results[i].campus_id == campus_results[j].campus_id) {
        if (!campus_results[j].building_results) {
          campus_results[j].building_results = [];
        }
        campus_results[j].building_results.push(building_results[i]);
        break;
      }
    }
  }
};