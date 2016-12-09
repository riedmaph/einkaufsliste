var path = require('path');

var db = require(path.join('..', 'dbconnector.js'));

var sqlFindProducts = db.loadSql(path.join('controllers', 'products', 'findProducts.sql'));

function findProducts(req, res, next) {
  req.body.searchstring = req.params.searchstring;

  db.conn.any(sqlFindProducts, req.body)
    .then(function (data) {
      if(data) {
        res.status(200)
          .json({
            products: data
          });
      }
    })
    .catch(function (err) {
      err.message = 'controllers.products.findProducts: ' + err.message;
      consle.log('test: ' + err.message);
      return next(err);
    });
}

module.exports = {
  findProducts
}