const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));
const lists = require(path.join('..', 'lists', 'lists.js'));

const LIST_ITEM_NAME_MAX_LENGTH = 140;

var sqlReadItems = db.loadSql(path.join('controllers', 'items', 'readItems.sql'));
var sqlCreateItem = db.loadSql(path.join('controllers', 'items', 'createItem.sql'));
var sqlGetIdItem = db.loadSql(path.join('controllers', 'items', 'getIdItem.sql'));

var sqlUpdateItem = db.loadSql(path.join('controllers', 'items', 'updateItem.sql'));
var sqlDeleteItem = db.loadSql(path.join('controllers', 'items', 'deleteItem.sql'));
var sqlGetPosition = db.loadSql(path.join('controllers', 'items', 'getPosition.sql'));
var sqlMoveItemDown = db.loadSql(path.join('controllers', 'items', 'moveItemDown.sql'));
var sqlMoveItemUp = db.loadSql(path.join('controllers', 'items', 'moveItemUp.sql'));

var sqlMoveItem = db.loadSql(path.join('controllers', 'items', 'moveItem.sql'));

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
      err.message = 'controllers.items.getListItems: ' + err.message;
      return next(err);

    });
}

function createItem(req, res, next) {
  if(req.body.name && req.body.name.length>LIST_ITEM_NAME_MAX_LENGTH) {
    return next({ message: 'input name is too long '});
  }
  req.body.listid = req.params.listid;
  req.body.amount = parseFloat(req.body.amount);
  req.body.id = uuid.v1();

  db.conn.none(sqlCreateItem, req.body)
    .then(function () {
      res.status(200)
      .json({
        id: req.body.id
      });
      // don't update recentList here, because items could be added through the offer page
    })
    .catch(function (err) {
      err.message = 'controllers.items.createItem: ' + err.message;
      return next(err);
    });

}

function updateItem(req, res, next) {
  if(req.body.name && req.body.name.length>LIST_ITEM_NAME_MAX_LENGTH) {
    return next({ message: 'input name is too long '});
  }
  req.body.listid = req.params.listid;
  req.body.id = req.params.itemid;
  req.body.amount = parseFloat(req.body.amount);

  db.conn.none(sqlUpdateItem, req.body)
    .then(function () {
      res.sendStatus(200);
      lists.updateRecentList(req.body.listid, req.body.userid);
    })
    .catch(function (err) {
      err.message = 'controllers.items.updateItem: ' + err.message;
      return next(err);
    });
}

function deleteItem(req, res, next) {
  req.body.id = req.params.itemid;

  db.conn.none(sqlDeleteItem, req.body)
    .then(function () {
      res.sendStatus(200);
      lists.updateRecentList(req.body.listid, req.body.userid);
    })
    .catch(function (err) {
      err.message = 'controllers.items.deleteItem: ' + err.message;
      return next(err);
    });
}

function moveItem(req, res, next) {
  req.body.listid = req.params.listid;
  req.body.id = req.params.itemid;
  req.body.targetposition = parseInt(req.body.targetposition);


  db.conn.none(sqlMoveItem, req.body)
    .then(function () {
      res.sendStatus(200);
      lists.updateRecentList(req.body.listid, req.body.userid);
    })
    .catch(function (err) {
      err.message = 'controllers.items.moveItem.sqlMoveItem: ' + err.message;
      return next(err);
    });
}

module.exports = {
  getListItems: getListItems,
  createItem: createItem,
  updateItem: updateItem,
  deleteItem: deleteItem,
  moveItem: moveItem
};
