var express = require('express');
var router = express.Router();
var tokenhandler = require('../controllers/tokenhandler');

var users = require('../controllers/users/users');
var lists = require('../controllers/lists/lists');
var items = require('../controllers/items/items');

// redirect root to doc
router.get('/', function(req, res, next) {
  res.redirect('/doc');
});

/* Users */
router.route('/users/register')
	.post(users.register);
router.route('/users/login')
	.post(users.login);

// check if a valid token is provided
router.use(tokenhandler.verifyToken);

/* ----- protected Routes ----- */
/* Lists */
router.route('/lists')
		.get(lists.getAllLists)
		.post(lists.createList)
		.put(lists.updateList)
		.delete(lists.deleteList);

/* items */
router.route('/lists/:listid/items')
		.get(items.getListItems)
		.post(items.createItem)
		.put(items.updateItem)
		.delete(items.deleteItem);

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.status(err.status || 500)
   	.json({
     	message: err.message
   });

});

module.exports = router;
