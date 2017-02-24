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

function getOptimisedList(req, res, next) {
  var options = {};
  options.listid = req.params.listid;
  options.userid = req.body.userid

  waterfall([
    async.apply(initialize, options)
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
    callback(null, itemList);
  })
  .catch(function (err) {
    err.message = 'controllers.optimisation.loadList: ' + err.message;
    callback(err);
  });
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