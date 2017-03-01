const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

const async = require('async');
const waterfall = require('async-waterfall');

var sqlReadItems = db.loadSql(path.join('controllers', 'optimisation', 'readItems.sql'));
var sqlFindOffers = db.loadSql(path.join('controllers', 'optimisation', 'findOffers.sql'));
var sqlCreateOptimisedList = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedList.sql'));
var sqlCreateOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedItem.sql'));
var sqlCreateOptimisedListMarket = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedListMarket.sql'));

var sqlReadOptimisedList = db.loadSql(path.join('controllers', 'optimisation', 'readOptimisedList.sql'));
var sqlReadOptimisedMarkets = db.loadSql(path.join('controllers', 'optimisation', 'readOptimisedMarkets.sql'));

var sqlUpdateOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'updateOptimisedItem.sql'));
var sqlSaveOptimisation = db.loadSql(path.join('controllers', 'optimisation', 'saveOptimisation.sql'));

//takes the user's selection and persists it to Userdata.OptimisedItem
function updateItem(req, res, next) {
  var sqlParams = {};
  sqlParams.listid = req.params.listid;
  sqlParams.itemid = req.params.itemid;
  sqlParams.name = req.body.name;
  sqlParams.amount = parseFloat(req.body.amount);
  sqlParams.unit = req.body.unit;
  sqlParams.offerUser = req.body.offerUser;

  db.conn.none(sqlUpdateOptimisedItem, sqlParams)
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
  var sqlParams = {};
  sqlParams.listid = req.params.listid;

  db.conn.none(sqlSaveOptimisation, sqlParams)
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
  options.optimiseBy = req.query.by;

  waterfall([                                      //use waterfall to be able to call error method in an easy way
    async.apply(initializeOptimisedList, options), //async.apply to hand over parameter to first method
    executeOptimisation,
    createOptimisedData,
    getOptimisationResult
  ], function (err, result, options) {
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
  var sqlParams = {};
  db.conn.task(function (t) {
    return t.map(sqlReadItems, options, function(item) { //load all items for list
      sqlParams.name = item.name;
      sqlParams.userid = options.userid;

      return t.any(sqlFindOffers, sqlParams)  //load offers for each item
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
          item.offerAlgorithm = null; //initalize offerAlgorithm to be in place
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
    err.message = 'controllers.optimise.initializeOptimisedList: ' + err.message;
    callback(err);
  });
}

function getOptimisationResult(result, options, callback) {
  var sqlParams = {}
  sqlParams.optimisedlistid = options.optimisedListId;

  db.conn.oneOrNone(sqlReadOptimisedList, sqlParams)
    .then(function (olist) {
      result.optimisationResult = {};
      result.optimisationResult.savings = olist.savings;
      result.optimisationResult.distance = olist.distance;

       db.conn.any(sqlReadOptimisedMarkets, sqlParams)
        .then(function (data) {
          result.optimisationResult.markets = data;
          callback(null, result, options);
        })
        .catch(function (err) {
          err.message = 'controllers.optimise.getOptimisationResult.sqlReadOptimisedMarkets: ' + err.message;
          callback(err);
      });

    })
    .catch(function (err) {
      err.message = 'controllers.optimise.getOptimisationResult.: ' + err.message;
      callback(err);
    });
}

//select the right optimisation-method
function executeOptimisation(result, options, callback) {
  if(options.optimiseBy == 'price') 
  {
    _optimiseByPrice(result, options, callback);
  }
  else
  {
    var err = {};
    err.message = 'controllers.initializeOptimisedList: ' + options.optimiseBy + ' not supported';
    callback(err);
  }
}

function _optimiseByPrice(result, options, callback) {
  var optimalOffer;

  options.optimisationResult = {};
  options.optimisationResult.savings = 0;

  result.items.forEach(function(item) {
    if(item.offers.length >= 1)
    {
      var optimalOffer = item.offers.reduce(function(prev, current) {
        return (_parseDiscount(prev.discount) < _parseDiscount(current.discount)) ? prev : current
      });

      optimalOffer.isOptimium = true;
      item.offerAlgorithm = optimalOffer.id;
      options.optimisationResult.savings += _getSaving(optimalOffer);
    }
  });
  callback(null, result, options);
}

function _parseDiscount(discount)
{
  if(discount == null)
  {
    return 0.0;
  }
  else
  {
    return parseFloat(discount);
  }
}

function _getSaving(offer)
{
  return parseFloat(((offer.offerprice / (1 + _parseDiscount(offer.discount)/100)) - offer.offerprice).toFixed(2));
}


function createOptimisedData(result, options, callback) {
   waterfall([
    async.apply(_createOptimisedList, result, options),
    _createOptimisedItems,
    _createOptimisedListMarket
  ], function (err, result, options) {
      if(!err) {
        callback(null, result, options);
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
  sqlParams.savings = options.optimisationResult.savings;  //TODOGB
  sqlParams.distance = 0; //TODOGB

  options.optimisedListId = sqlParams.id; //for further opterations

  db.conn.none(sqlCreateOptimisedList, sqlParams)  //create db-entry for optimisedList
    .then(function (data) {
      callback(null, result, options);
    })
    .catch(function (err) {
      err.message = 'controllers.optimise._createOptimisedDataList: ' + err.message;
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
      sqlParams.offerAlgorithm = item.offerAlgorithm;

      return t.none(sqlCreateOptimisedItem, sqlParams);
    });
    return t.batch(queries);
  })
  .then(function (data) {          
    callback(null, result, options);
  })
  .catch(function (err) {
    err.message = 'controllers.optimise._createOptimisedItems: ' + err.message;
    callback(err);
  });
}

function _createOptimisedListMarket(result, options, callback) {   
  var sqlParams = {}
  sqlParams.optimisedlistid = options.optimisedListId;

  db.conn.task(function (t) {                            
    var queries = result.items.map(function (item) {
      if(item.offerAlgorithm) {
        sqlParams.offerid = item.offerAlgorithm;s
        return t.none(sqlCreateOptimisedListMarket, sqlParams); //create db-entries for each optimisedListMarket    
      }
      else {
        return null;
      }
    });
    return t.batch(queries);
  })
  .then(function (data) {          
    callback(null, result, options);
  })
  .catch(function (err) {
    err.message = 'controllers.optimise._createOptimisedListMarket: ' + err.message;
    callback(err);
  });
}

module.exports = {
  getOptimisedList: getOptimisedList,
  updateItem: updateItem,
  saveOptimisedList: saveOptimisedList
};