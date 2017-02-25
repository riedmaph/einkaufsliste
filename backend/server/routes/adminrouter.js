var express = require('express');
var router = express.Router();
var path = require('path');

var logger = require(path.join('..', 'logging', 'logger'));

var tokenhandler = require(path.join('..', 'controllers', 'tokenhandler'));

var transformation = require(path.join('..', 'controllers', 'admin', 'transformation'));

// check if a valid token is provided
router.use(tokenhandler.verifyAdminToken);

router.route('/products/blacklist')
  .post(transformation.postProductBlacklist)

router.route('/transformation/articles')
  .post(transformation.postArticleRaw)

router.route('/transformation/articles/size/:id')
  .get(transformation.getTransformedUnitBySize)
  .put(transformation.putTransformedUnitBySize)

router.route('/transformation/articles/brand/mine/:id')
  .get(transformation.getMineBrand)
  .put(transformation.putMineBrand)

router.route('/transformation/articles/productName/mine/:id')
  .get(transformation.getMineProductName)
  .put(transformation.putMineProductName)

router.route('/transformation/articles/:id/:end')
//  .get(transformation.getArticleTransformation)
  .put(transformation.putArticleTransformation)

router.route('/transformation/articles/:id')
//  .get(transformation.getArticleTransformation)
  .put(transformation.putArticleTransformation)

// error handler
router.use(function(err, req, res, next) {
  logger.log('error', err.message);
  // set locals, only providing error in development
  res.status(err.status || 500)
    .json({
      message: err.message
   });

});
  
module.exports = router;
