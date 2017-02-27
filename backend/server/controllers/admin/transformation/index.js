var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..', 'dbconnector.js'));

var sizeTransformation = require(path.join('..', 'transformation', 'size', 'index'));
var brandTransformation = require(path.join('..', 'transformation', 'brand', 'index'));
var productNameTransformation = require(path.join('..', 'transformation', 'productName', 'index'));

var sqlInsertArticle = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'insertArticle.sql'));
var sqlInsertArticleRaw = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'insertArticleRaw.sql'));


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
  var returnData;
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      switch (index) {
        case 0:
          return sizeTransformation.transformUnitBySize(t,req.params.id);
        case 1:
          return sizeTransformation.insertMineLogSize(t,data);
        case 2:
          returnData=data;
       }
    })
  })
    .then(empty => {
      res.status(200).send(returnData);
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
  var returnData;
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      switch (index) {
        case 0:
          return brandTransformation.transformMineBrand(t,req.params.id);
        case 1:
          return brandTransformation.insertMineLogBrand(t,data);
        case 2:
          returnData=data;
       }
    })
  })
    .then(empty => {
      res.status(200).send(returnData);
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
  var returnData;
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      switch (index) {
        case 0:
          return productNameTransformation.transformMineProductName(t,req.params.id);
        case 1:
          return productNameTransformation.insertMineLogProductName(t,data);
        case 2:
          returnData=data;
       }
    })
  })
    .then(empty => {
      res.status(200).send(returnData);
    })
    .catch(err => {
      console.log(JSON.stringify(err));
      err.message = 'controllers.admin.transformation.putMineProductName ' + JSON.stringify(err);
      return next(err);
    });
}

function getArticleTransformation(req, res, next) {
  productNameTransformation.transformMineProductName({},req.params.id)
    .then(function (transformedUnit) {
      res.status(200)
        .json(transformedUnit);
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.getMineProductName ' + err.message;
      return next(err);
    });
}

function putArticleTransformation(req, res, next) {
  var returnData = [];
  var id = parseInt(req.params.id);
  var end = parseInt(req.params.end || req.params.id);
  if (end < id) {
    console.error(end,id,end < id);
    res.status(400).send();
    return;
  }
  db.connTransform.tx(t => {
    return t.sequence((index, data, delay) => {
      if (id == end && index%7==0 && index!=0) {
        return undefined;
      }
      if (index!=0 && index%7==0){
        returnData.push(data);
        ++id;
      }
      switch (index%7) {
        case 0:
          return sizeTransformation.transformUnitBySize(t,id);
        case 1:
          return sizeTransformation.insertMineLogSize(t,data);
        case 2:
          return brandTransformation.transformMineBrand(t,id);
        case 3:
          return brandTransformation.insertMineLogBrand(t,data);
        case 4:
          return productNameTransformation.transformMineProductName(t,id);
        case 5:
          return productNameTransformation.insertMineLogProductName(t,data);
        case 6:
          return t.one(sqlInsertArticle,{ id: id });
      }  
    })
  })
    .then(empty => {
      res.status(200).send(returnData);
    })
    .catch(err => {
      console.log(JSON.stringify(err));
      err.message = 'controllers.admin.transformation.putMineProductName ' + JSON.stringify(err);
      return next(err);
    });
}

function postArticleRaw(req, res, next) {
  db.connTransform.one(sqlInsertArticleRaw,req.body)
    .then(function (newArticle) {
      res.status(201)
        .json(newArticle);
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.postArticle: ' + err.message;
      return next(err);
    });
}

function postProductBlacklist(req, res, next) {
  productNameTransformation.postProductBlacklist(req.body.userid,req.body.entry)
    .then(() => {
      res.status(201).send();
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.' + arguments.callee.toString().slice("function ".length,arguments.callee.toString().indexOf('(')) + ': ' + (err.message?err.message:"");
      console.log(err.message);
      return next(err);
    });
}

function postProductForce(req, res, next) {
  productNameTransformation.postProductForce(req.body.userid,req.body.title,req.body.target)
    .then(() => {
      res.status(201).send();
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.' + arguments.callee.toString().slice("function ".length,arguments.callee.toString().indexOf('(')) + ': ' + (err.message?err.message:"");
      console.log(err.message);
      return next(err);
    });
}

function postProduct(req, res, next) {
  productNameTransformation.postProduct(req.body.userid,req.body.entry)
    .then(() => {
      res.status(201).send();
    })
    .catch(err => {
      err.message = 'controllers.admin.transformation.' + arguments.callee.toString().slice("function ".length,arguments.callee.toString().indexOf('(')) + ': ' + (err.message?err.message:"");
      console.log(err.message);
      return next(err);
    });
}

module.exports = {
  getArticleTransformation,
  getMineBrand,
  getMineProductName,
  getTransformedUnitBySize,
  postArticleRaw,
  postProduct,
  postProductBlacklist,
  postProductForce,
  putArticleTransformation,
  putMineBrand,
  putMineProductName,
  putTransformedUnitBySize,
};
