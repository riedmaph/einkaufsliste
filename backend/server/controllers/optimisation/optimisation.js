const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

const async = require('async');
const waterfall = require('async-waterfall');

var sqlReadItems = db.loadSql(path.join('controllers', 'items', 'readItems.sql'));

//var sql = db.loadSql(path.join('optimization', 'optimization', '.sql'));

function updateItem(req, res, next) {

}

function getOptimisedList(req, res, next) {
  var listId = req.params.listid;

  waterfall([
    async.apply(initialize, listId)
    //executeOptimisation(oList),
    //persistOptimisedList(oList)
  ], function (err, oList) {
      if(!err) {
        res.status(200)
        .json(
          oList
        );
      }
      else {
        console.log('errorhandling');
        next(err);    

      }
  });

}

function initialize(listId, callback) {
   waterfall([
     async.apply(_loadList, listId),
    _loadOffers,
    _loadMarkets
  ], function (err, oList) {
      if(!err) {
        callback(null, oList);
      }
      else {
        callback(err);        
      }
  });
}

function _loadList(listId, callback) {
  var options = {};
  options.listid = listId;

  db.conn.any(sqlReadItems, options)
  .then(function (data) {
    var oList = {};
    oList = {
        items: data
      };
    callback(null, oList);
  })
  .catch(function (err) {
    err.message = 'controllers.optimisation.loadList: ' + err.message;
    callback(err);
  });
}

function _loadOffers(oList, callback) {
  console.log("_loadOffers");
  callback(null, oList);
}

function _loadMarkets(oList, callback) {
  console.log("_loadMarkets");
  callback(null, oList);
}

function executeOptimisation(oList, method, callback) {
  //call right optimisation
}

function optimiseByPrice(oList) {

}

function persistOptimisedList(oList, callback) {

}

module.exports = {
  getOptimisedList: getOptimisedList,
  updateItem: updateItem
};