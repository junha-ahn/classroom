let redis = require('redis'),
  client = redis.createClient();

let self = {
  set(key, value, expire_sec) {
    if (expire_sec) {
      client.set(key, value, 'EX', expire_sec);
    } else {
      client.set(key, value);
    }
  },
  get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, result) => {
        if (err) {
          reject (err)
        } else {
          resolve(result)
        }
      });
    })
  },
}
module.exports = self;