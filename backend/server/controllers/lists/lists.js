const path = require('path');
var uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

var sqlReadLists = db.loadSql(path.join('controllers', 'lists', 'readLists.sql'));
var sqlCreateList = db.loadSql(path.join('controllers', 'lists', 'createList.sql'));
var sqlUpdateList = db.loadSql(path.join('controllers', 'lists', 'updateList.sql'));
var sqlDeleteList = db.loadSql(path.join('controllers', 'lists', 'deleteList.sql'));

var sqlReadList = db.loadSql(path.join('controllers', 'lists', 'readList.sql'));
var sqlReadItems = db.loadSql(path.join('controllers', 'items', 'readItems.sql'));

function getAllLists(req, res, next) {
  db.conn.any(sqlReadLists, req.body)
    .then(function (data) {
      res.status(200)
        .json({
          lists: data
        });
    })
    .catch(function (err) {
      err.message = 'controllers.lists.getAllLists: ' + err.message;
      return next(err);
    });
}

function getListWithItems(req, res, next) {
  req.body.id = req.params.listid;
  db.conn.oneOrNone(sqlReadList, req.body)
    .then(function (list) {
      if(list) {
        req.body.listid = req.params.listid;
        db.conn.any(sqlReadItems, req.body)
          .then(function (data) {
            list.items=data;
            res.status(200)
              .json(list);
          })
          .catch(function (err) {
            err.message = 'controllers.lists.getListWithItems.sqlReadItems: ' + err.message;
            return next(err);
          });
      }
      else {
        res.status(404)
          .json({
            message: 'A list with the requested ID does not exists.'
          });
      }
    })
    .catch(function (err) {
      err.message = 'controllers.lists.getListWithItems.sqlReadList: ' + err.message;
      return next(err);
    });
}

function createList(req, res, next) {
  req.body.id = uuid.v1();
  db.conn.none(sqlCreateList, req.body)
      .then(function (data) {
        res.status(200)
          .json({
            id: req.body.id
          });
        })
      .catch(function (err) {
        err.message = 'controllers.lists.createList: ' + err.message;
        return next(err);
      });
}

function updateList(req, res, next) {
  req.body.id = req.params.listid;
  db.conn.none(sqlUpdateList, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      err.message = 'controllers.lists.updateList: ' + err.message;
      return next(err);
    });
}

function deleteList(req, res, next) {
  req.body.id = req.params.listid;
  db.conn.none(sqlDeleteList, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      err.message = 'controllers.lists.deleteList: ' + err.message;
      return next(err);
    });
}

module.exports = {
  getAllLists: getAllLists,
  getListWithItems: getListWithItems,
  createList: createList,
  updateList: updateList,
  deleteList: deleteList
};