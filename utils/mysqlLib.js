const mysql = require('mysql');

const constants = require('./constants');

exports.initializeConnectionPool = initializeConnectionPool;
exports.mysqlQueryPromise        = mysqlQueryPromise;

function initializeConnectionPool() {
    return new Promise( (resolve, reject) => {
      console.log('CALLING INITIALIZE POOL');
      var numConnectionsInPool = 0;
      const conn = mysql.createPool({
        host              : 'rrj.h.filess.io',
        port              : 3307,
        user              : 'wallet_becomesend',
        password          : '3a4d3b9d6c5b1de9787a1e9730df2835a5ac0fbd',
        database          : 'wallet_becomesend',
        multipleStatements: true
      });
      conn.on('connection', function (connection) {
        numConnectionsInPool++;
      });
      return resolve(conn);
    });
};

function mysqlQueryPromise(event, queryString, params) {
  return new Promise((resolve, reject) => {
    const query = mysqlConnection.query(queryString, params, function (sqlError, sqlResult) {
      if (sqlError || !sqlResult) {
        if (sqlError) {
          return reject({ERROR: constants.responseMessages.MYSQL_ERROR, EVENT: event});
        }
      }
      return resolve(sqlResult);
    });
  });
};