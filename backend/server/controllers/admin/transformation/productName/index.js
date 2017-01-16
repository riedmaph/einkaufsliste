var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlMineProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName', 'mineProductName.sql'));
var sqlInsertMineLogProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertMineLogProductName.sql'));

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

module.exports = {
  transformMineProductName,
  insertMineLogProductName,
};
