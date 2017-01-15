var path = require('path');

var db = require(path.join('..', 'dbconnector.js'));

var sqlReadFavouriteMarkets = db.loadSql(path.join('controllers', 'markets', 'readFavouriteMarkets.sql'));
var sqlAddFavouriteMarket = db.loadSql(path.join('controllers', 'markets', 'addFavouriteMarket.sql'));
var sqlRemoveFavouriteMarket = db.loadSql(path.join('controllers', 'markets', 'removeFavouriteMarket.sql'));

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
  getFavouriteMarkets: getFavouriteMarkets,
  addToFavouriteMarkets: addToFavouriteMarkets,
  removeFromFavouriteMarkets: removeFromFavouriteMarkets
}