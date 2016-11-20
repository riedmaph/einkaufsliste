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

// using an invalid connection string:
var db = pgp('postgresql://elisaapi:elite_se10@127.0.0.1:5432/articledb');

db.connect()
    .then(function (obj) {
        obj.done(); // success, release the connection;
    })
    .catch(function (error) {
        console.log("ERROR:", error.message || error);
    });

module.exports = {
	getAllLists: getAllLists,
  createList: createList,
  updateList: updateList,
  getListItems: getListItems,
  createItem: createItem,
  updateItem: updateItem
};

/* --- Lists ----*/
function getAllLists(req, res, next) {
  db.any('SELECT list.id as id, list.name as name, (SELECT COUNT(*) FROM UserData.Item item WHERE item.list = list.id) as count FROM UserData.List list')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
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
  db.none('UPDATE UserData.List set name=$1 where id=$2', [req.body.name, parseInt(req.params.id)])
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
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createItem(req, res, next) {
  req.body.list = parseInt(req.body.list);
  req.body.amount = parseFloat(req.body.amount);
  db.none('INSERT INTO UserData.Item(list, name, amount, unit) VALUES(${list}, ${name}, ${amount}, ${unit})', req.body)
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
  db.none('UPDATE UserData.Item set list=$1, name=$2, amount=$3, unit=$4 where id=$5', 
    [parseInt(req.body.list), req.body.name, parseFloat(req.body.amount), req.body.unit, parseInt(req.params.id)])
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
