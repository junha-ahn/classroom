let pool = require('../db.js');

let self = {
  getDBConnection : () => {
    return new Promise((resolve, reject) => {
      pool.getConnection(function(error,connection){
        if(error) {
          reject(error);
        }
        else{
          resolve(connection)
        }
      });
    });
  },
  beginTransaction : (connection) => {
    return new Promise((resolve, reject) => {
      connection.beginTransaction(function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
  commit : (connection) => {
    return new Promise((resolve, reject) => {
      connection.commit(function(error) {
        if (error){
            return connection.rollback(function() {
                reject(error);
            });
        }
        else {
          resolve();
        }
      });
    });
  },
  release: (connection) => {
    if (connection && connection._pool._freeConnections.indexOf(connection) != 0) {
      connection.release();
    } 
  },
  sendQueryToDB : (connection,queryString, isTransaction) => {
    return new Promise((resolve, reject) => {
      connection.query(queryString.text, queryString.values,(error, result, fields)=>{
        if (error) { 
          if (isTransaction) {
            return connection.rollback(function() { 
              reject(error)
            }); 
          } else {
            reject(error)
          }
        }
        else {
          resolve(result);          
        }
      });
    });
  },
  inDBStream: (innerAction) => {
    return async (req,res,next) => {
      let connection;
      try {
        connection = await self.getDBConnection();
        await innerAction(req, res, next, connection);
      } catch (e) {
        next(e)
      } finally {
        self.release(connection);
      }
    }
  },
}
module.exports = self;