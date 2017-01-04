var path = require('path');

var db = require(path.join('..', 'dbconnector.js'));

var sqlGetMarkets = db.loadSql(path.join('controllers', 'markets', 'getMarketsByPositionAndRadius.sql'));

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

module.exports = {
  getMarketsByPositionAndRadius: getMarketsByPositionAndRadius
 }