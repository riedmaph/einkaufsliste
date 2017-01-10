var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlInsertMineLogSize = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'size', 'insertMineLogSize.sql'));
var sqlUnitBySize = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'size','unitBySize.sql'));

function transformUnitBySize(id, write, forceWrite) {
  return new Promise((fullfill, reject) => {
    db.connTransform.one(sqlUnitBySize, { id })
      .then(function (data) {
        if (write) {
          if (forceWrite) {
            console.err("unsupported"); // do a delete and perform together with insert in batch
            throw unsupported;
          }
          db.connTransform.none(sqlInsertMineLogSize, data)
            .then( function () {
              fullfill(data);
            })
            .catch(function (err) {
              err.message = 'controllers.admin.unitBySizeInsert: ' + err.message;
              reject(err);
            });
        } else {
          fullfill(data);
        }
      })
      .catch(function (err) {
        err.message = 'controllers.admin.unitBySize: ' + err.message;
        reject(err);
      });
  });
}

module.exports = {
  transformUnitBySize,
};
