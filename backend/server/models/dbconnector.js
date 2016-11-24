var options = {
  // Initialization Options
};

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

var dbsettings = require('../../database/config');

var cn = {
    host: dbsettings.dbhost,
    port: dbsettings.dbport,
    database: dbsettings.dbname,
    user: dbsettings.dbuserapi,
    password: dbsettings.dbpassapi
};

var db = pgp(cn);

db.connect()
    .then(function (obj) {
        obj.done(); // success, release the connection;
    })
    .catch(function (error) {
        console.log("ERROR:", error.message || error);
    });

module.exports = {
	getAllLists,
  createList,
  updateList,
  deleteList,
  getListItems,
  createItem,
  updateItem,
  deleteItem
};

/* --- Lists ----*/
function getAllLists(req, res, next) {
  db.any('SELECT list.id as id, list.name as name, (SELECT COUNT(*) FROM UserData.Item item WHERE item.list = list.id) as count FROM UserData.List list')
    .then(function (data) {
      res.status(200)
        .json({
          lists: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createList(req, res, next) {
  db.none('INSERT INTO UserData.List(name) VALUES(${name})', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateList(req, res, next) {
  req.body.id = parseInt(req.body.id);
  db.none('UPDATE UserData.List set name=${name} where id=${id}', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteList(req, res, next) {
  req.body.id = parseInt(req.body.id);
  db.none('DELETE from UserData.List where id=${id}', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

/* --- Items ----*/
function getListItems(req, res, next) {
  var listId = parseInt(req.params.listid);
  db.any('SELECT * FROM UserData.Item WHERE list = $1', listId)
    .then(function (data) {
      res.status(200)
        .json({
          items: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createItem(req, res, next) {
  req.body.listid = parseInt(req.body.listid);
  req.body.amount = parseFloat(req.body.amount);
  db.none('INSERT INTO UserData.Item(list, name, amount, unit) VALUES(${listid}, ${name}, ${amount}, ${unit})', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateItem(req, res, next) {
  req.body.listid = parseInt(req.body.listid);
  req.body.id = parseInt(req.body.id);
  req.body.amount = parseFloat(req.body.amount);

  db.none('UPDATE UserData.Item set list=${listid}, name=${name}, checked=${checked}, amount=${amount}, unit=${unit} where id=${id}', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteItem(req, res, next) {
  req.body.id = parseInt(req.body.id);
  db.none('DELETE from UserData.Item where id=${id}', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}