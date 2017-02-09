const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

var sqlReadItems = db.loadSql(path.join('optimization', 'optimization', '.sql'));

function updateItem(req, res, next) {

}

function optimiseList(req, res, next) {

}

function initialize(listid) {
  var oList;

  //load List

  //load Offers

  return oList;
}

function selectOptimisation(oList, method) {
  //call right optimisation
}

