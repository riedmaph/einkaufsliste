const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

const async = require('async');
const waterfall = require('async-waterfall');

var sqlCloseUnsavedOptimisations = db.loadSql(path.join('controllers', 'optimisation', 'closeUnsavedOptimisations.sql'));

var sqlReadItems = db.loadSql(path.join('controllers', 'optimisation', 'readItems.sql'));
var sqlFindOffers = db.loadSql(path.join('controllers', 'optimisation', 'findOffers.sql'));
var sqlCreateOptimisedList = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedList.sql'));
var sqlCreateOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'createOptimisedItem.sql'));
var sqlRefreshOptimisedListMarket = db.loadSql(path.join('controllers', 'optimisation', 'refreshOptimisedListMarket.sql'));

var sqlReadOptimisedList = db.loadSql(path.join('controllers', 'optimisation', 'readOptimisedList.sql'));
var sqlReadOptimisedMarkets = db.loadSql(path.join('controllers', 'optimisation', 'readOptimisedMarkets.sql'));

var sqlReadOptimisedListID = db.loadSql(path.join('controllers', 'optimisation', 'readOptimisedListID.sql'));

var sqlReadUserOfferOfOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'readUserOfferOfOptimisedItem.sql'));
var sqlReadOfferById = db.loadSql(path.join('controllers', 'optimisation', 'readOfferById.sql'));
var sqlUpdateOptimsedList = db.loadSql(path.join('controllers', 'optimisation', 'updateOptimsedList.sql'));

var sqlUpdateOptimisedItem = db.loadSql(path.join('controllers', 'optimisation', 'updateOptimisedItem.sql'));
var sqlSaveOptimisation = db.loadSql(path.join('controllers', 'optimisation', 'saveOptimisation.sql'));

//takes the user's selection and persists it to Userdata.OptimisedItem
function saveUserselection(req, res, next) {
  var options = {};
  options.listid = req.params.listid;
  options.itemid = req.params.itemid;
  options.name = req.body.name;
  options.amount = parseFloat(req.body.amount);
  options.unit = req.body.unit;
  options.offeruser = req.body.offerUser;

  var result={};

  waterfall([                                      //use waterfall to be able to call error method in an easy way
    async.apply(_getOptimisedListID, result, options), //async.apply to hand over parameter to first method
    _updateSavings,
    _updateItem,
    _refreshOptimisedListMarket,
    _getOptimisationResult
  ], function (err, result, options) {
      if(!err) {
        res.status(200)
        .json(
          result.optimisationResult
        );
      }
      else {
        next(err);
      }
  });  
}

//find the acutal optimisedlist by listid and last startdate
function _getOptimisedListID(result, options, callback) {
  var sqlParams = {};
  sqlParams.listid = options.listid;

  db.conn.oneOrNone(sqlReadOptimisedListID, sqlParams)
  .then(function (olist) {
      options.optimisedlistid = olist.id;   //save optimsedlistid for further operations
      callback(null,  result, options);
    })
    .catch(function (err) {
      err.message = 'controllers.optimise._getOptimisedListID: ' + err.message;
      callback(err);
    });
}

function _updateSavings(result, options, callback) {
  var savingOld=0;
  var savingNew=0;

  var sqlParams = {};
  sqlParams.itemid = options.itemid;
  sqlParams.optimisedlistid = options.optimisedlistid;

   db.conn.oneOrNone(sqlReadUserOfferOfOptimisedItem, sqlParams)  //get savings from old offer
    .then(function (offerOld) {
      if(offerOld != null) {
        savingOld =_getSaving(offerOld);
      }

      sqlParams = {};
      sqlParams.offerid =  options.offeruser;

      db.conn.oneOrNone(sqlReadOfferById, sqlParams) //get savings from new offer
        .then(function (offerNew) {
          if(offerNew != null) {
            savingNew =_getSaving(offerNew);
          }

          sqlParams = {};
          sqlParams.optimisedlistid = options.optimisedlistid;
          sqlParams.savingschange = (savingNew - savingOld);

          db.conn.none(sqlUpdateOptimsedList, sqlParams)
            .then(function () {
              callback(null, result, options);
            })
            .catch(function (err) {
              err.message = 'controllers.optimise._updateSavings.updateOfferList ' + err.message;
              callback(err);
            });        
        })
        .catch(function (err) {
          err.message = 'controllers.optimise._updateSavings.loadNewOffer: ' + err.message;
          callback(err);
        });
    })
    .catch(function (err) {
      err.message = 'controllers.optimise._updateSavings.loadOldOffer: ' + err.message;
      callback(err);
    });
}

function _updateItem(result, options, callback) {
  db.conn.none(sqlUpdateOptimisedItem, options)
    .then(function () {
      callback(null, result, options);
    })
    .catch(function (err) {
      err.message = 'controllers.optimise._updateItem: ' + err.message;
      callback(err);
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
  var options = {};
  options.listid = req.params.listid;
  options.userid = req.body.userid
  options.optimiseBy = req.query.by;

  waterfall([                                      //use waterfall to be able to call error method in an easy way
    async.apply(closeOldOptimisations, options), //async.apply to hand over parameter to first method
    initializeOptimisedList,
    executeOptimisation,
    createOptimisedData,
    _getOptimisationResult
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

//sets endate and saved=false for not saved optimisations
function closeOldOptimisations(options, callback) {
  db.conn.none(sqlCloseUnsavedOptimisations, options)
    .then(function () {
      callback(null, options);
    })
    .catch(function (err) {
      err.message = 'controllers.optimise.closeOldOptimisations: ' + err.message;
      return next(err);
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
                title: offer.title,
                market: offer.market, 
                offerprice: offer.offerprice, 
                offerfrom: offer.offerfrom, 
                offerto: offer.offerto, 
                discount: offer.discount, 
                isOptimum: false,
                article:{
                  name: offer.articlename, 
                  brand: offer.articlebrand
                },
                marketInfo: {
                  id: offer.marketid, 
                  name: offer.marketname,
                  street: offer.marketstreet,
                  zip: offer.marketzip,
                  city: offer.marketcity,
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

//load saving distance(TODO) and markets for finished optimisation
function _getOptimisationResult(result, options, callback) {
  var sqlParams = {}
  sqlParams.optimisedlistid = options.optimisedlistid;

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
          err.message = 'controllers.optimise._getOptimisationResult.sqlReadOptimisedMarkets: ' + err.message;
          callback(err);
      });

    })
    .catch(function (err) {
      err.message = 'controllers.optimise._getOptimisationResult.: ' + err.message;
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

      optimalOffer.isOptimum = true;
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

//persists optimisation data
function createOptimisedData(result, options, callback) {
   waterfall([
    async.apply(_createOptimisedList, result, options),
    _createOptimisedItems,
    _refreshOptimisedListMarket
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

  options.optimisedlistid = sqlParams.id; //for further opterations

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
      sqlParams.optimisedlistid = options.optimisedlistid;
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

function _refreshOptimisedListMarket(result, options, callback) {   
  var sqlParams = {}
  sqlParams.optimisedlistid = options.optimisedlistid;

  //TODO use only db data
  db.conn.none(sqlRefreshOptimisedListMarket, sqlParams)                            
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
  saveUserselection: saveUserselection,
  saveOptimisedList: saveOptimisedList
};