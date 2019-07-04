module.exports = () => {
  let global_data = require('../global/data');
  let campus_results = global_data.campus_results;
  let building_results = global_data.building_results;
  let buildings = {}; 
  for (let i in building_results) {
    if (!buildings[building_results[i].campus_id]) {
      buildings[building_results[i].campus_id] = [];
    }
    buildings[building_results[i].campus_id].push(building_results[i])
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
  global_data.buildings = buildings;
};