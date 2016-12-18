var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var apirouter = require('./routes/apirouter');
var logger = require('./logging/logger');

var app = express();

//use winston for http logging
if(process.env.NODE_ENV != 'test') {
    app.use(morgan("combined", { "stream": logger.stream }));
}

// set the view engine to jade
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/doc', express.static(path.join(__dirname, 'doc')));

//set router
app.use('/api', apirouter);

//redirect root to doc
app.get('/', function(req, res) {
    res.redirect('/doc');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  //log error
  logger.log('debug', err.message);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports.logger = logger;
