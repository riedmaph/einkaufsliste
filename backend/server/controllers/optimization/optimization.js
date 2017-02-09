const path = require('path');
const uuid = require('uuid');

const db = require(path.join('..', 'dbconnector.js'));

var sqlReadItems = db.loadSql(path.join('optimization', 'optimization', '.sql'));

function optimizeList(req, res, next) {

}

function updateItem(req, res, next) {

}