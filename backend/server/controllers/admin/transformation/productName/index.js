var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlMineProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName', 'mineProductName.sql'));
var sqlInsertMineLogProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertMineLogProductName.sql'));

function transformMineProductName(id, write, forceWrite) {
  return new Promise((fullfill, reject) => {
    db.connTransform.any(sqlMineProductName, { id })
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
              queries.push(t.none(sqlInsertMineLogProductName, d));
            });
            return t.batch(queries);
          })
          .then( function () {
            fullfill(data);
          })
          .catch(function (err) {
            err.message = 'controllers.admin.transformation.productname.mineinsert: ' + err.message;
            reject(err);
          });
        } else {
          fullfill(data);
        }
      })
      .catch(function (err) {
        err.message = 'controllers.admin.transformation.productname.mineinsert: ' + err.message;
        reject(err);
      });
  });
}

module.exports = {
  transformMineProductName,
};
