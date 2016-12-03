var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..', 'dbconnector.js'));

var sqlReadLists = db.loadSql(path.join('controllers', 'lists', 'readLists.sql'));
var sqlCreateList = db.loadSql(path.join('controllers', 'lists', 'createList.sql'));
var sqlUpdateList = db.loadSql(path.join('controllers', 'lists', 'updateList.sql'));
var sqlDeleteList = db.loadSql(path.join('controllers', 'lists', 'deleteList.sql'));

function getAllLists(req, res, next) {
  db.conn.any(sqlReadLists, req.body)
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
  db.conn.none(sqlCreateList, req.body)
      .then(function (data) {
        res.status(200)
          .json({
            id: req.body.id
          });
        })
      .catch(function (err) {
        return next(err);
      });
}

function updateList(req, res, next) {
  db.conn.none(sqlUpdateList, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteList(req, res, next) {
  db.conn.none(sqlDeleteList, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllLists,
  createList,
  updateList,
  deleteList
};