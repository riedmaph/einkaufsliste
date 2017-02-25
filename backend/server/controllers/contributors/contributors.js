const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

var sqlRead = db.loadSql(path.join('controllers', 'contributors', 'read.sql'));
var sqlInsert = db.loadSql(path.join('controllers', 'contributors', 'insert.sql'));
var sqlDelete = db.loadSql(path.join('controllers', 'contributors', 'delete.sql'));

function getListContributors(req, res, next) {
  req.body.listid = req.params.listid;

  db.conn.any(sqlRead, req.params)
    .then(function (data) {
      res.status(200)
        .json({
          contributors: data
        });
    })
    .catch(function (err) {
      err.message = 'controllers.contributors.getListContributors: ' + err.message;
      return next(err);

    });
}

function addContributor(req, res, next) {
  req.body.listid = req.params.listid;

  db.conn.result(sqlInsert, req.body)
    .then(function (status) {
      if (status.rowCount) {
        res.sendStatus(200);
      } else {
        res.status(404)
        .json({
          message: "User with the given email not found."
        });
      }
      
    })
    .catch(function (err) {
      err.message = 'controllers.contributors.addContributor: ' + err.message;
      return next(err);
    });
        
}

function removeContributor(req, res, next) {
  req.body.listid = req.params.listid;
  
  db.conn.result(sqlDelete, req.body)
    .then(function (status) {
      if (status.rowCount) {
        res.sendStatus(200);
      } else {
        res.status(404)
        .json({
          message: "The list does not have a contributor with the given email address."
        });
      }
    })
    .catch(function (err) {
      err.message = 'controllers.contributors.removeContributor: ' + err.message;
      return next(err);
    });
}

module.exports = {
  getListContributors: getListContributors,
  addContributor: addContributor,
  removeContributor: removeContributor
};