var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..', 'dbconnector.js'));

var sizeTransformation = require(path.join('..', 'transformation', 'size', 'index'));
var brandTransformation = require(path.join('..', 'transformation', 'brand', 'index'));
var productNameTransformation = require(path.join('..', 'transformation', 'productName', 'index'));

function getTransformedUnitBySize(req, res, next) {
  sizeTransformation.transformUnitBySize(db.connTransform,req.params.id)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.getTransformedUnit: ' + err.message;
      return next(err);
    });
}

function putTransformedUnitBySize(req, res, next) {
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      switch (index) {
        case 0:
          return sizeTransformation.transformUnitBySize(t,req.params.id);
        case 1:
          return sizeTransformation.insertMineLogSize(t,data);
      }
    })
  })
    .then(transformedUnit => {
      res.status(200).send();
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.putTransformedUnit' + err.message;
      return next(err);
    });
}

function getMineBrand(req, res, next) {
  brandTransformation.transformMineBrand(db.connTransform,req.params.id)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.getMineBrand ' + err.message;
      return next(err);
    });
}

function putMineBrand(req, res, next) {
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      switch (index) {
        case 0:
          return brandTransformation.transformMineBrand(t,req.params.id);
        case 1:
          return brandTransformation.insertMineLogBrand(t,data);
      }
    })
  })
    .then(function (transformedUnit) {
      res.status(200).send();
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.putMineBrand ' + err;
      return next(err);
    });
}

function getMineProductName(req, res, next) {
  productNameTransformation.transformMineProductName(db.connTransform,req.params.id)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.getMineProductName ' + err.message;
      return next(err);
    });
}

function putMineProductName(req, res, next) {
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      switch (index) {
        case 0:
          return productNameTransformation.transformMineProductName(t,req.params.id);
        case 1:
          return productNameTransformation.insertMineLogProductName(t,data);
      }
    })
  })
    .then(function (transformedUnit) {
      res.status(200).send();
    })
    .catch(err => {
      console.log(JSON.stringify(err));
      err.message = 'controllers.admin.transformation.putMineProductName ' + JSON.stringify(err);
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
