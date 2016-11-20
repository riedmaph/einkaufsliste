var express = require('express');
var router = express.Router();

var dbconnector = require('../models/dbconnector');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'test' });
});

router.get('/api/lists', dbconnector.getAllLists);
router.post('/api/lists', dbconnector.createList);
router.put('/api/lists/:id', dbconnector.updateList);

router.get('/api/lists/:id', dbconnector.getListItems);
router.post('/api/items', dbconnector.createItem);
router.put('/api/items/:id', dbconnector.updateItem);

module.exports = router;
