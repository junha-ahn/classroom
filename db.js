const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 25,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  debug: false,
  timezone: 'utc',
});

pool.on('connection', function (connection) {
  console.log('연결 발생');
});
pool.on('release', function (connection) {
  console.log('연결 종료');
});
module.exports = pool;