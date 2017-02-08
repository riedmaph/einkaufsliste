const path = require('path');

const db = require(path.join('..', 'dbconnector.js'));

var sqlFindProducts = db.loadSql(path.join('controllers', 'autocompletion', 'findProducts.sql'));
var sqlFindArticles = db.loadSql(path.join('controllers', 'autocompletion', 'findArticles.sql'));

function findItems(req, res, next) {
  var options = {};
  options.searchstring = req.query.q;

  db.conn.any(sqlFindProducts, options)
    .then(function (products) {
      db.conn.any(sqlFindArticles, options)
        .then(function (articles) {
          res.status(200)
            .json({
              products: products,
              articles: articles
            });        
        })
        .catch(function (err) {
          err.message = 'controllers.autocompletion.findProducts: ' + err.message;
          return next(err);
        });
    })
    .catch(function (err) {
      err.message = 'controllers.autocompletion.findProducts: ' + err.message;
      return next(err);
    });
}

module.exports = {
  findItems : findItems
}


