var uuid = require('uuid');
var tokenhandler = require('./tokenhandler');

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
  register,
  login,
	getAllLists,
  createList,
  updateList,
  deleteList,
  getListItems,
  createItem,
  updateItem,
  deleteItem
};

/* ---- Users ---- */
function register(req, res, next) {
  db.oneOrNone('SELECT enduser.id as id, enduser.mail as mail, enduser.password as password FROM UserData.Enduser where mail = ${mail}', req.body)
    .then(function (user) {
      if(!user) {
        req.body.id = uuid.v1();
        db.none('INSERT INTO UserData.Enduser(id, mail, password) VALUES(${id}, ${mail}, ${password})', req.body)
          .then(function () {
            res.status(200)
              .json({
                token: tokenhandler.createToken(req.body.id)
              });
          })
          .catch(function (err) {
            return next(err);
          });
      }
      else {
        res.status(409)
          .json({
            message: 'User with this email-address already exists.'
          });
      }
    })
    .catch(function (err) {
      return next(err);
    });
}

function login(req, res, next) {
  db.oneOrNone('SELECT enduser.id as id, enduser.mail as mail, enduser.password as password FROM UserData.Enduser where mail = ${mail}', req.body)
    .then(function (user) {
      if(user) {
        if(user.password == req.body.password) {
          res.status(200)
          .json({
            token: tokenhandler.createToken(user.id)
          });
        }
        else {
          res.status(401)
          .json({
            message: 'Wrong password.'
          });
        }

      }
      else {
        res.status(404)
          .json({
            message: 'User does not exist.'
          });

      }
    })
    .catch(function (err) {
      return next(err);
    });
}

/* --- Lists ---- */
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
  req.body.id = uuid.v1();
  req.body.userid = req.decoded.userid; //get userid from token
  db.none('INSERT INTO UserData.List(id, enduser, name) VALUES(${id}, ${userid}, ${name})', req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateList(req, res, next) {
  req.body.id = parseInt(req.body.id);
  db.none('UPDATE UserData.List set name=${name} where id=${id}', req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteList(req, res, next) {
  req.body.id = parseInt(req.body.id);
  db.none('DELETE from UserData.List where id=${id}', req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

/* --- Items ----*/
function getListItems(req, res, next) {
  var listId = req.params.listid;
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
  req.body.listid = req.params.listid;
  req.body.amount = parseFloat(req.body.amount);

  db.none('INSERT INTO UserData.Item(list, name, amount, unit) VALUES(${listid}, ${name}, ${amount}, ${unit})', req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateItem(req, res, next) {
  req.body.listid = req.params.listid;
  req.body.id = parseInt(req.body.id);
  req.body.amount = parseFloat(req.body.amount);

  console.log(req.body.listid);

  db.none('UPDATE UserData.Item set list=${listid}, name=${name}, checked=${checked}, amount=${amount}, unit=${unit} where id=${id}', req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteItem(req, res, next) {
  req.body.id = req.params.listid;
  db.none('DELETE from UserData.Item where id=${id}', req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}