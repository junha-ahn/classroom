const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const USER_TYPE = 10;
const ADMIN_TYPE = 30;

const USER_TYPE_ARRAY = [USER_TYPE, ADMIN_TYPE];

const REQ_RSV_STATUS = 20;
const CANCEL_RSV_STATUS = 40;
const CANCEL_REQ_RSV_STATUS = 60;
const SUBMIT_RSV_STATUS = 80;

const RSV_STATUS_ARRAY = [REQ_RSV_STATUS, CANCEL_RSV_STATUS, CANCEL_REQ_RSV_STATUS, SUBMIT_RSV_STATUS]
const db_data = require('./db_data.json');

module.exports = {
  timeZone,
  USER_TYPE,
  ADMIN_TYPE,
  USER_TYPE_ARRAY,
  REQ_RSV_STATUS,
  CANCEL_RSV_STATUS,
  CANCEL_REQ_RSV_STATUS,
  SUBMIT_RSV_STATUS,
  RSV_STATUS_ARRAY,
  ...db_data,
}