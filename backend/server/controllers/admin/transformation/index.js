var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..', 'dbconnector.js'));

var sizeTransformation = require(path.join('..', 'transformation', 'size', 'index'));
var brandTransformation = require(path.join('..', 'transformation', 'brand', 'index'));
var productNameTransformation = require(path.join('..', 'transformation', 'productName', 'index'));

function getTransformedUnitBySize(req, res, next) {
  sizeTransformation.transformUnitBySize(req.params.id,false,false)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      return next(err);
    });
}

function putTransformedUnitBySize(req, res, next) {
  sizeTransformation.transformUnitBySize(req.params.id,true,false)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      return next(err);
    });
}

function getMineBrand(req, res, next) {
  brandTransformation.transformMineBrand(req.params.id,false,false)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      return next(err);
    });
}

function putMineBrand(req, res, next) {
  brandTransformation.transformMineBrand(req.params.id,true,false)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      return next(err);
    });
}

function getMineProductName(req, res, next) {
  productNameTransformation.transformMineProductName(req.params.id,false,false)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      return next(err);
    });
}

function putMineProductName(req, res, next) {
  productNameTransformation.transformMineProductName(req.params.id,true,false)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      return next(err);
    });
}

module.exports = {
  getMineBrand,
  getMineProductName,
  getTransformedUnitBySize,
  putMineBrand,
  putMineProductName,
  putTransformedUnitBySize,
};
