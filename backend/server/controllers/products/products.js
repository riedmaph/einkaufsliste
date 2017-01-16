const path = require('path');

const db = require(path.join('..', 'dbconnector.js'));

var sqlFindProducts = db.loadSql(path.join('controllers', 'products', 'findProducts.sql'));

function findProducts(req, res, next) {
  var options = {};
  options.searchstring = req.query.q;

  db.conn.any(sqlFindProducts, options)
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
      return next(err);
    });
}

module.exports = {
  findProducts : findProducts
}