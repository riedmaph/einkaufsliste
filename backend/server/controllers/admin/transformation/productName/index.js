var path = require('path');
var uuid = require('uuid');

var db = require(path.join('..','..','..', 'dbconnector.js'));

var sqlMineProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName', 'mineProductName.sql'));
var sqlInsertMineLogProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertMineLogProductName.sql'));

var sqlInsertProductBlacklist = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertProductBlacklist.sql'));
var sqlUpdateSourceBlacklist = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','updateSourceBlacklist.sql'));
var sqlInsertProductForce = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertProductForce.sql'));


var sqlFindUserInSource = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','findUserInSource.sql'));
var sqlInsertUserToSource = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertUserToSource.sql'));
var sqlUpdateUserToSource = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','updateUserToSource.sql'));
var sqlUpsertProductName = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','upsertProductName.sql'));
var sqlInsertProductNameSource = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','insertProductNameSource.sql'));

var sqlUpdateTransformationProductForce = db.loadSqlTransform(path.join('controllers', 'admin', 'transformation', 'productName','updateTransformationProductForce.sql'));

function transformMineProductName(t, id) {
  return t.any(sqlMineProductName, { id });
}

function insertMineLogProductName(t, data) {
  var queries = [];
  data.forEach(d => {
    queries.push(t.any(sqlInsertMineLogProductName, d));
  });
  return t.batch(queries);
}

function postProductBlacklist(userid, string){
  return new Promise((fullfill, reject) => {
    db.connTransform.tx(t => {
      return t.sequence((index, data, delay) => {
        switch (index) {
          case 0:
            return t.any(sqlInsertProductBlacklist,{ userid: userid, string: string });
          case 1:
            // discredit source
            return t.any(sqlUpdateSourceBlacklist,{ string: string });
        }
      });
    })
    .then(() => fullfill())
    .catch(err => { reject({message: err}); });
  });
}

function postProductForce(userid,title, target){
  return new Promise((fullfill, reject) => {
    db.connTransform.any(sqlInsertProductForce,{ userid: userid, title: title, target: target })
    .then(() => fullfill())
    .catch(err => { reject({message: err}); });
  });
}

function postProduct(userid, productName){
  return new Promise((fullfill, reject) => {
    db.connTransform.tx(t => {
      return t.sequence((index, data, delay) => {
        switch (index) {
          case 0:
            return t.any(sqlFindUserInSource, { userid: userid });
          case 1:
            if(data.length) {
              return t.any(sqlUpdateUserToSource, { userid: userid });
            } else {
              return t.any(sqlInsertUserToSource, { userid: userid });
            }
          case 2:
            return t.any(sqlUpsertProductName, { userid: userid, productName: productName });
          case 3: //insert source or update counter
            return t.any(sqlInsertProductNameSource,{ userid: userid, productName: productName });
        }
      });
    })
    .then(() => fullfill())
    .catch(err => { reject({message: err.error.error}); });
  });
}

function putForceProduct(userid, id){
  return new Promise((fullfill, reject) => {
    db.connTransform.any(sqlUpdateTransformationProductForce,{ userid: userid, id: id })
    .then(() => fullfill())
    .catch(err => { reject({message: err}); });
  });
}


module.exports = {
  transformMineProductName,
  insertMineLogProductName,
  postProduct,
  postProductBlacklist,
  postProductForce,
};
