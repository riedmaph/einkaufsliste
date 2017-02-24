var path = require('path');
var db = require(path.join('..', '..', 'controllers','dbconnector.js'));

var sqlDeletetUser = db.loadSql(path.join('test', 'dbhandler', 'sqlDeletetUser.sql'));
var sqlGetIdsOrderedByPositionList = db.loadSql(path.join('test', 'dbhandler', 'sqlGetIdsOrderedByPositionList.sql'));
var sqlSetUpMoveItems = db.loadSql(path.join('test', 'dbhandler', 'setUpMoveItems.sql'));
var sqlSetOptimisation = db.loadSql(path.join('test', 'dbhandler', 'setOptimisation.sql'));


module.exports.deleteUsers = function (callback) {
  db.conn.none(sqlDeletetUser)
    .then(function () {
      callback();
    })
    .catch(function (err) {
      console.log(err.message);
      callback(err);
    });
}

module.exports.setUpMoveItems = function (callback) {
  db.conn.none(sqlSetUpMoveItems)
    .then(function () {
      callback();
    })
    .catch(function (err) {
      console.log(err.message);
      callback(err);
    });
}

module.exports.getIdsOrderedByPositionList = function (listid, callback) {
  var params ={};
  params.listid = listid;

  db.conn.any(sqlGetIdsOrderedByPositionList, params)
   .then(function (data) {
     callback(data);
   })
   .catch(function (err) {
    console.log(err.message);
    callback(err);
   });
}

module.exports.setOptimisation = function (callback) {
  db.conn.none(sqlSetOptimisation)
    .then(function () {
      callback();
    })
    .catch(function (err) {
      console.log(err.message);
      callback(err);
    });
}
