var express = require('express');
var router = express.Router();
var path = require('path');

var logger = require(path.join('..', 'logging', 'logger'));

var transformation = require(path.join('..', 'controllers', 'admin', 'transformation'));

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

  module.exports = router;
