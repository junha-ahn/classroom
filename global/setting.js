module.exports = () => {
  let global_data = require('./info');

  let department_results = global_data.department_results;
  let campus_results = global_data.campus_results;
  let building_results = global_data.building_results;
   
  global_data.campuses = []; 
  global_data.buildings = {}; 

  global_data.campus_object = {}; 
  global_data.building_object = {}; 
  global_data.department_object = {}; 

  for (let i in department_results) {
    global_data.department_object[department_results[i].department_id] = department_results[i];
  }

  for (let i in building_results) {
    global_data.building_object[building_results[i].building_id] = building_results[i];
    if (!global_data.buildings[building_results[i].campus_id]) {
      global_data.buildings[building_results[i].campus_id] = [];
    }
    global_data.buildings[building_results[i].campus_id].push(building_results[i]);
  }

  for (let i in campus_results) {
    global_data.campus_object[campus_results[i].campus_id] = campus_results[i];
    global_data.campuses.push({
      ...campus_results[i],
      building_results: global_data.buildings[campus_results[i].campus_id],
    });
  }

};