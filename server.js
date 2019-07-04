require('dotenv/config');
require('./global/setting')();

let http = require('http');
let app = require('./app');
let server = http.Server(app);
let port = process.argv[2] || process.env.PORT;

server.listen(port, function () {
  console.log('HTTP Server Running :',port);
});