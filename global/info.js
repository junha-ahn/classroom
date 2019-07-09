const USER_TYPE = 10;
const ADMIN_TYPE = 30;

const USER_TYPE_ARRAY = [USER_TYPE, ADMIN_TYPE];

const db_data = require('./db_data.json');

module.exports = {
  USER_TYPE,
  ADMIN_TYPE,
  USER_TYPE_ARRAY,
  ...db_data,
}