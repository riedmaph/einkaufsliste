var path = require('path');

var options = {
    // global event notification;
    error: function (error, e) {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message || error);
        }
    }
};

var pgp = require("pg-promise")(options);

var dbsettings = require(path.join('..', '..', 'config', 'config'));

var cn = {
    host: dbsettings.dbhost,
    port: dbsettings.dbport,
    database: dbsettings.dbname,
    user: dbsettings.dbuserapi,
    password: dbsettings.dbpassapi
};

//set settings to load sql-scripts according to ENV
var loadSqlSettings;

if(process.env.NODE_ENV == 'test') {
  loadSqlSettings = {
      schemaname: dbsettings.dbschemanameuserdatatest
  }
}
else {
  loadSqlSettings = {
      schemaname: dbsettings.dbschemanameuserdata
  }
}

var conn = pgp(cn);

conn.connect()
    .then(function (obj) {
        obj.done(); // success, release the connection;
    })
    .catch(function (error) {
        console.log("ERROR:", error.message || error);
    });


module.exports.conn = conn;
// Helper for linking to external query files: 
module.exports.loadSql = function (file) {
  return new pgp.QueryFile(file, {minify: true, params:loadSqlSettings});
}