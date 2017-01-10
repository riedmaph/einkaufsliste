var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlMineBrand = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'brand', 'mineBrand.sql'));
var sqlInsertMineLogBrand = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'brand','insertMineLogBrand.sql'));

function transformMineBrand(id, write, forceWrite) {
  return new Promise((fullfill, reject) => {
    db.connTransform.any(sqlMineBrand, { id })
      .then(function (data) {
        if (data.length == 0) {
          fullfill(data);
          return;
        }
        if (write) {
          if (forceWrite) {
            console.err("unsupported"); // do a delete and perform together with insert in batch
            throw unsupported;
          }
          db.connTransform.tx(t => {
            var queries = [];
            data.forEach(d => {
              queries.push(t.none(sqlInsertMineLogBrand, d));
            });
            return t.batch(queries);
          })
          .then( function () {
            fullfill(data);
          })
          .catch(function (err) {
            err.message = 'controllers.admin.transformation.brand.mineInsert: ' + err.message;
            reject(err);
          });
        } else {
          fullfill(data);
        }
      })
      .catch(function (err) {
        err.message = 'controllers.admin.transformation.brand.mineInsert: ' + err.message;
        reject(err);
      });
  });
}

module.exports = {
  transformMineBrand,
};
