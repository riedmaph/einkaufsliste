var path = require('path');

var db = require(path.join('..', 'dbconnector.js'));

var sqlGetMarkets = db.loadSql(path.join('controllers', 'markets', 'getMarketsByPositionAndRadius.sql'));
var sqlReadOffers = db.loadSql(path.join('controllers', 'markets', 'readOffers.sql'));
var sqlReadFavouriteMarkets = db.loadSql(path.join('controllers', 'markets', 'readFavouriteMarkets.sql'));
var sqlAddFavouriteMarket = db.loadSql(path.join('controllers', 'markets', 'addFavouriteMarket.sql'));
var sqlRemoveFavouriteMarket = db.loadSql(path.join('controllers', 'markets', 'removeFavouriteMarket.sql'));

function getMarketsByPositionAndRadius(req, res, next) {
  req.query.maxdistance = req.query['max-distance'];
  db.conn.any(sqlGetMarkets, req.query)
    .then(function (data) {
      res.status(200)
        .json({
          markets: data
        });
    })
    .catch(function (err) {
      err.message = 'controllers.markets.getMarketsByPositionAndRadius: ' + err.message;
      return next(err);
    });
}

function getOffers(req, res, next) {
  db.conn.any(sqlReadOffers, req.params)
    .then(function (data) {
      res.status(200)
        .json({          
          offers: data.map(
            function(offer) 
            {
              return {
                        id: offer.id, 
                        market: offer.market, 
                        offerprice: offer.offerprice, 
                        offerfrom: offer.offerfrom, 
                        offerto: offer.offerto, 
                        discount: offer.discount, 
                        product:{
                          name: offer.name, 
                          brand: offer.brand, 
                          price: offer.price
                        }
                      }
            }
          )
        });
    })
    .catch(function (err) {
      err.message = 'controllers.markets.getOffers: ' + err.message;
      return next(err);
    });
}

function getFavouriteMarkets(req, res, next) {
  db.conn.any(sqlReadFavouriteMarkets, req.body)
    .then(function (data) {
      res.status(200)
        .json({
          markets: data
        });
    })
    .catch(function (err) {
      err.message = 'controllers.markets.getFavouriteMarkets: ' + err.message;
      return next(err);
    });
}

function addToFavouriteMarkets(req, res, next) {
  req.body.id = req.params.marketid;

  db.conn.any(sqlAddFavouriteMarket, req.body)
    .then(function (data) {
      res.sendStatus(200);
    })
    .catch(function (err) {
      err.message = 'controllers.markets.addToFavouriteMarkets: ' + err.message;
      return next(err);
    });
}

function removeFromFavouriteMarkets(req, res, next) {
  req.body.id = req.params.marketid;

  db.conn.any(sqlRemoveFavouriteMarket, req.body)
    .then(function (data) {
      res.sendStatus(200);
    })
    .catch(function (err) {
      err.message = 'controllers.markets.removeFromFavouriteMarkets: ' + err.message;
      return next(err);
    });
}

module.exports = {
  getMarketsByPositionAndRadius: getMarketsByPositionAndRadius,
  getOffers: getOffers,
  getFavouriteMarkets: getFavouriteMarkets,
  addToFavouriteMarkets: addToFavouriteMarkets,
  removeFromFavouriteMarkets: removeFromFavouriteMarkets  
 }

