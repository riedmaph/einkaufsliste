var express = require('express');
var router = express.Router();
var path = require('path');

var logger = require(path.join('..', 'logging', 'logger'));

var tokenhandler = require(path.join('..', 'controllers', 'tokenhandler'));

var users = require(path.join('..', 'controllers', 'users', 'users'));
var lists = require(path.join('..', 'controllers', 'lists', 'lists'));
var items = require(path.join('..', 'controllers', 'items', 'items'));
var contributors = require(path.join('..', 'controllers', 'contributors', 'contributors'));
var products = require(path.join('..', 'controllers', 'products', 'products'));
var markets = require(path.join('..', 'controllers', 'markets', 'markets'));

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

router.route('/lists/:listid')
  .get(lists.getListWithItems)
  .put(lists.updateList)
  .delete(lists.deleteList);

/* items */
router.route('/lists/:listid/items')
  .get(items.getListItems)
  .post(items.createItem)

router.route('/lists/:listid/items/:itemid')
  .put(items.updateItem)
  .delete(items.deleteItem)
  .patch(items.moveItem);


/* contributors */
router.route('/lists/:listid/contributors')
  .get(contributors.getListContributors)
  .post(contributors.addContributor)
  .delete(contributors.removeContributor);


/* products */
router.route('/products/search')
  .get(products.findProducts)

/* markets */
router.route('/markets')
  .get(markets.getMarkets);

router.route('/markets/:marketid/offers')
  .get(markets.getOffers);
  
router.route('/markets/favourites')
  .get(markets.getFavouriteMarkets);

router.route('/markets/favourites/:marketid')
  .post(markets.addToFavouriteMarkets)
  .delete(markets.removeFromFavouriteMarkets);

// error handler
router.use(function(err, req, res, next) {
  logger.log('error', err.message);
  // set locals, only providing error in development
  res.status(err.status || 500)
    .json({
      message: err.message
   });

});

module.exports = router;
