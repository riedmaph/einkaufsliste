var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlMineBrand = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'brand', 'mineBrand.sql'));
var sqlInsertMineLogBrand = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'brand','insertMineLogBrand.sql'));

function transformMineBrand(t,id) {
    return t.any(sqlMineBrand, { id });
}

function insertMineLogBrand(t,data) {
  var queries = [];
  data.forEach(d => {
    queries.push(t.any(sqlInsertMineLogBrand, d));
  });
  return t.batch(queries);
}


function discoverBrand(id, write, forceWrite) {
  return new Promise ((fullfill,reject) => {
    transformMineBrand(id,false,false)
    .then(d => {
      var brandName='';
      var maxLikelihood=-1;
    });
  });
}


module.exports = {
  transformMineBrand,
  insertMineLogBrand,
};
