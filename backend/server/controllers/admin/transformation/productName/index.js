var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlMineProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName', 'mineProductName.sql'));
var sqlInsertMineLogProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertMineLogProductName.sql'));

var sqlInsertProductBlacklist = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertProductBlacklist.sql'));
var sqlUpdateSourceBlacklist = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','updateSourceBlacklist.sql'));

function transformMineProductName(t, id) {
  return t.any(sqlMineProductName, { id });
}

function insertMineLogProductName(t, data) {
  var queries = [];
  data.forEach(d => {
    queries.push(t.any(sqlInsertMineLogProductName, d));
  });
  return t.batch(queries);
}

function postProductBlacklist(userid, string){
  return new Promise((fullfill, reject) => {
    db.connTransform.tx(t => {
      return t.sequence((index, data, delay) => {
        switch (index) {
          case 0:
            return t.any(sqlInsertProductBlacklist,{ userid: userid, string: string });
          case 1:
            // discredit source
            return t.any(sqlUpdateSourceBlacklist,{ string: string });
        }
      });
    })
    .then(() => fullfill())
    .catch(err => { reject({message: err}); });
  });
}
module.exports = {
  transformMineProductName,
  insertMineLogProductName,
  postProductBlacklist,
};
