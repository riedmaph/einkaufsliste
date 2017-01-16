var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlUnitBySize = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'size','unitBySize.sql'));
var sqlInsertMineLogSize = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'size', 'insertMineLogSize.sql'));

function transformUnitBySize(t,id) {
  return t.one(sqlUnitBySize, { id });
}

function insertMineLogSize(t,data) {
  return t.one(sqlInsertMineLogSize, data);
}

module.exports = {
  transformUnitBySize,
  insertMineLogSize,
};
