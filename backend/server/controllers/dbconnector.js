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

var dbsSel = dbsettings.selectedDb;
var dbsDb = dbsettings.databases[dbsSel]
var dbsUser = dbsettings.users.api

var cn = {
    host: process.env.PGHOST || dbsDb.dbhost,
    port: process.env.PGPORT || dbsDb.dbport,
    database: dbsDb.dbname,
    user: dbsUser.username,
    password: dbsUser.pw
};

//set settings to load sql-scripts according to ENV
var loadSqlSettings;

if(process.env.NODE_ENV == 'test') {
  loadSqlSettings = {
      schemaname: "userdata_test"
  }
}
else {
  loadSqlSettings = {
      schemaname: "userdata"
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

var cn = {
    user: dbsUser.username,
    password: dbsUser.pw
};
var cnTransform = {
    host: process.env.PGHOST || dbsDb.dbhost,
    port: process.env.PGPORT || dbsDb.dbport,
    database: dbsDb.dbname,
    user: dbsettings.users.transformer.username,
    password: dbsettings.users.transformer.pw,
};

//set settings to load sql-scripts according to ENV
var loadSqlSettingsTransform = {
  schemaTransformed: 'transformed',
  schemaCrawled: 'crawled',
}

var connTransform = pgp(cnTransform);

connTransform.connect()
    .then(function (obj) {
        obj.done(); // success, release the connection;
    })
    .catch(function (error) {
        console.log("ERROR: Transformer:", error.message || error);
    });


module.exports.connTransform = connTransform;
// Helper for linking to external query files: 
module.exports.loadSqlTransform = function (file) {
  return new pgp.QueryFile(file, {minify: true, params:loadSqlSettingsTransform});
}
