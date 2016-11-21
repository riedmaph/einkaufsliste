var express = require('express');
var router = express.Router();

var dbconnector = require('../models/dbconnector');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'test' });
});

router.get('/api/lists', dbconnector.getAllLists);
router.post('/api/lists', dbconnector.createList);
router.put('/api/lists', dbconnector.updateList);
router.delete('/api/lists', dbconnector.deleteList);

router.get('/api/items/:listid', dbconnector.getListItems);
router.post('/api/items', dbconnector.createItem);
router.put('/api/items', dbconnector.updateItem);
router.delete('/api/items', dbconnector.deleteItem);


module.exports = router;
