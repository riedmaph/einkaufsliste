const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

const async = require('async');
const waterfall = require('async-waterfall');

var sqlReadItems = db.loadSql(path.join('controllers', 'items', 'readItems.sql'));
var sqlFindOffers = db.loadSql(path.join('controllers', 'optimisation', 'findOffers.sql'));

//var sql = db.loadSql(path.join('optimization', 'optimization', '.sql'));

function updateItem(req, res, next) {

}

function saveOptimisedList(req, res, next) {

}

function getOptimisedList(req, res, next) {
  var options = {};
  options.listid = req.params.listid;
  options.userid = req.body.userid

  waterfall([
    async.apply(initialize, options), //async.apply to hand over parameter to first method
    executeOptimisation,
    createOptimisedList
  ], function (err, itemList) {
      if(!err) {
        res.status(200)
        .json(
          itemList
        );
      }
      else {
        next(err);    
      }
  });
}

//load items for given list and suitable offers for each item
function initialize(options, callback) {
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
      var itemList = {};
      itemList = {
          items: data
        };
    callback(null, itemList, options);
  })
  .catch(function (err) {
    err.message = 'controllers.optimisation.loadList: ' + err.message;
    callback(err);
  });
}

//select the right optimisation-method
function executeOptimisation(itemList, options, callback) {
  //call right optimisation
  callback(null, itemList, options);
}

function _optimiseByPrice(itemList) {

}

function createOptimisedList(itemList, options, callback) {
  //write optimsed list to db 
  callback(null, itemList);
}

module.exports = {
  getOptimisedList: getOptimisedList,
  updateItem: updateItem
};