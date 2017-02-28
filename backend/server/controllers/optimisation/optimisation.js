const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

const async = require('async');
const waterfall = require('async-waterfall');

var sqlReadItems = db.loadSql(path.join('controllers', 'optimisation', 'readItems.sql'));
var sqlFindOffers = db.loadSql(path.join('controllers', 'optimisation', 'findOffers.sql'));
var sqlCreateOptimisedList = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedList.sql'));
var sqlCreateOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedItem.sql'));
var sqlUpdateOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'updateOptimisedItem.sql'));
var sqlSaveOptimisation = db.loadSql(path.join('controllers', 'optimisation', 'saveOptimisation.sql'));

//takes the user's selection and persists it to Userdata.OptimisedItem
function updateItem(req, res, next) {
  var options = {};
  options.listid = req.params.listid;
  options.itemid = req.params.itemid;
  options.name = req.body.name;
  options.amount = parseFloat(req.body.amount);
  options.unit = req.body.unit;
  options.offerUser = req.body.offerUser;

  db.conn.none(sqlUpdateOptimisedItem, options)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      err.message = 'controllers.optimise.updateItem: ' + err.message;
      return next(err);
    });
}

//takes the values from Userdata.OptimisedItem and updates Userdata.Item
function saveOptimisedList(req, res, next) {
  var options = {};
  options.listid = req.params.listid;

  db.conn.none(sqlSaveOptimisation, options)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      err.message = 'controllers.optimise.saveOptimisedList: ' + err.message;
      return next(err);
    });
}

//returns the optimised list
function getOptimisedList(req, res, next) {
  //TODO close old list (set enddate)
  var options = {};
  options.listid = req.params.listid;
  options.userid = req.body.userid

  waterfall([                                      //use waterfall to be able to call error method in an easy way
    async.apply(initializeOptimisedList, options), //async.apply to hand over parameter to first method
    executeOptimisation,
    createOptimisedData
  ], function (err, result) {
      if(!err) {
        res.status(200)
        .json(
          result
        );
      }
      else {
        next(err);    
      }
  });
}

//load items for given list and suitable offers for each item
function initializeOptimisedList(options, callback) {
    db.conn.task(function (t) {
      return t.map(sqlReadItems, options, function(item) { //load all items for list
        options.name = item.name;
        return t.any(sqlFindOffers, options)  //load offers for each item
          .then(function(offers) {
            offers = offers.map(
              function(offer) 
              {
                return {
                  id: offer.id, 
                  market: offer.market, 
                  offerprice: offer.offerprice, 
                  offerfrom: offer.offerfrom, 
                  offerto: offer.offerto, 
                  discount: offer.discount, 
                  isOptimium: false,
                  article:{
                    name: offer.articlename, 
                    brand: offer.articlebrand
                  }
                }
              }
            );
            item.offers = offers;
            return item;
          });
    }).then(t.batch)
   })
   .then(function (data) {
      var result = {};
      result = {
          items: data
        };
    callback(null, result, options);
  })
  .catch(function (err) {
    err.message = 'controllers.initializeOptimisedList: ' + err.message;
    callback(err);
  });
}

//select the right optimisation-method
function executeOptimisation(result, options, callback) {
  //call right optimisation
  callback(null, result, options);
}

function _optimiseByPrice(result) {

}

function createOptimisedData(result, options, callback) {
   waterfall([
    async.apply(_createOptimisedList, result, options),
    _createOptimisedItems
  ], function (err, result) {
      if(!err) {
        callback(null, result);
      }
      else {
        callback(err);   
      }
  });
}

function _createOptimisedList(result, options, callback) {
  var sqlParams = {};
  sqlParams.id = uuid.v1();
  sqlParams.userid = options.userid;
  sqlParams.listid = options.listid;

  options.optimisedListId = sqlParams.id;

  db.conn.none(sqlCreateOptimisedList, sqlParams)  //create db-entry for optimisedList
    .then(function (data) {
      callback(null, result, options);
    })
    .catch(function (err) {
      err.message = 'controllers.createOptimisedDataList: ' + err.message;
      callback(err);
    });
}

function _createOptimisedItems(result, options, callback) {
  var sqlParams = {}

  db.conn.task(function (t) {                               //create db-entries for each optimsedItem
    var queries = result.items.map(function (item) {
      sqlParams.id = uuid.v1();
      sqlParams.item = item.id;
      sqlParams.optimisedlistid = options.optimisedListId;
      sqlParams.position = item.position;
      sqlParams.name = item.name;
      sqlParams.amount = item.amount;
      sqlParams.unit = item.unit;
      sqlParams.offerAlgorithm = null;

      return t.none(sqlCreateOptimisedItem, sqlParams);
    });
    return t.batch(queries);
  })
  .then(function (data) {          
    callback(null, result);
  })
  .catch(function (err) {
    err.message = 'controllers.createOptimisedData.createOptimisedItems: ' + err.message;
    callback(err);
  });
}

module.exports = {
  getOptimisedList: getOptimisedList,
  updateItem: updateItem,
  saveOptimisedList: saveOptimisedList
};