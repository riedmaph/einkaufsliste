var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..', 'dbconnector.js'));

var sqlReadItems = db.loadSql(path.join('controllers', 'items', 'readItems.sql'));
var sqlCreateItem = db.loadSql(path.join('controllers', 'items', 'createItem.sql'));
var sqlGetIdItem = db.loadSql(path.join('controllers', 'items', 'getIdItem.sql'));
var sqlGetPositionItem = db.loadSql(path.join('controllers', 'items', 'getPositionItem.sql'));
var sqlUpdateItem = db.loadSql(path.join('controllers', 'items', 'updateItem.sql'));
var sqlDeleteItem = db.loadSql(path.join('controllers', 'items', 'deleteItem.sql'));
var sqlMoveItemDown = db.loadSql(path.join('controllers', 'items', 'moveItemDown.sql'));
var sqlMoveItemUp = db.loadSql(path.join('controllers', 'items', 'moveItemUp.sql'));

function getListItems(req, res, next) {
  var listId = req.params.listid;
  db.conn.any(sqlReadItems, req.params)
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

  db.conn.one(sqlGetIdItem, req.body)
    .then(function (data) {

      req.body.id = parseInt(data.maxid) + 1;

      db.conn.one(sqlGetPositionItem, req.body)
        .then(function (data) {

          req.body.position = parseInt(data.maxposition) + 1;

          db.conn.none(sqlCreateItem, req.body)
            .then(function () {
              res.status(200)
              .json({
                id: req.body.id
              });
            })
            .catch(function (err) {
              return next(err);
            });
        })
        .catch(function (err) {          
          return next(err);
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateItem(req, res, next) {
  req.body.listid = req.params.listid;
  req.body.id = parseInt(req.body.id);
  req.body.amount = parseFloat(req.body.amount);

  db.conn.none(sqlUpdateItem, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteItem(req, res, next) {
  db.conn.none(sqlDeleteItem, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function moveItem(req, res, next) {  
  req.body.listid = req.params.listid;

  var sql;

  if(req.body.from < req.body.to) {         //move down
    sql = sqlMoveItemDown;
  }
  else {                                    //move up
    sql = sqlMoveItemUp;
  }

  db.conn.none(sql, req.body)
      .then(function () {
        res.sendStatus(200);
      })
      .catch(function (err) {
        console.log(err);
        return next(err);
      });
}

module.exports = {
  getListItems,
  createItem,
  updateItem,
  deleteItem,
  moveItem
};