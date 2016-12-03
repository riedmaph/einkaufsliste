var path = require('path');
var db = require(path.join('..', '..', 'controllers','dbconnector.js'));

var sqlDeletetUser = db.loadSql(path.join('test', 'dbhandler', 'sqlDeletetUser.sql'));

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

