var express = require('express');
var router = express.Router();
var tokenhandler = require('../controllers/tokenhandler');

var dbconnector = require('../controllers/dbconnector');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'test' });
});

router.post('/users/register', dbconnector.register);
router.post('/users/login', dbconnector.login);

// check if a valid token is provided
router.use(tokenhandler.verifyToken);

/* ----- protected Routes ----- */

router.get('/lists', dbconnector.getAllLists);
router.post('/lists', dbconnector.createList);
router.put('/lists', dbconnector.updateList);
router.delete('/lists', dbconnector.deleteList);

router.get('/lists/:listid/items', dbconnector.getListItems);
router.post('/lists/:listid/items', dbconnector.createItem);
router.put('/lists/:listid/items', dbconnector.updateItem);
router.delete('/lists/:listid/items', dbconnector.deleteItem);

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.status(err.status || 500)
   	.json({
     	message: err.message
   });

});

module.exports = router;
