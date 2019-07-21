module.exports = () => {
  let global_data = require('./info');

  let department_results = global_data.department_results;
  let room_category_results = global_data.room_category_results;
  let room_rsv_category_results = global_data.room_rsv_category_results;
  let building_results = global_data.building_results;
  let campus_results = global_data.campus_results;
   
  global_data.campuses = []; 
  global_data.buildings = {}; 

  global_data.department_object = {}; 
  global_data.room_category_object = {}; 
  global_data.room_rsv_category_object = {}; 
  global_data.building_object = {}; 
  global_data.campus_object = {}; 

  for (let i in department_results) {
    global_data.department_object[department_results[i].department_id] = department_results[i];
  }
  for (let i in room_category_results) {
    global_data.room_category_object[room_category_results[i].room_category_id] = room_category_results[i];
  }
  for (let i in room_rsv_category_results) {
    global_data.room_rsv_category_object[room_rsv_category_results[i].room_rsv_category_id] = room_rsv_category_results[i];
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