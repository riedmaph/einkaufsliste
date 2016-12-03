var path = require('path');

var uuid = require('uuid');
var password = require('password-hash-and-salt');

var db = require(path.join('..', 'dbconnector.js'));
var tokenhandler = require(path.join('..', 'tokenhandler'));

var sqlRegisterCheckUser = db.loadSql(path.join('controllers', 'users', 'registerCheckUser.sql'));
var sqlRegisterInsertUser = db.loadSql(path.join('controllers', 'users', 'registerInsertUser.sql'));

function validatePassword(password) {
  return password.length >= 7;
}

function register(req, res, next) {
  db.conn.oneOrNone(sqlRegisterCheckUser, req.body)
    .then(function (user) {
      if(!user) {

        if(validatePassword(req.body.password)) {
          //hash&salt password
          password(req.body.password).hash(function(error, hash) {
            if(error)
                throw new Error('Error in hashing password!');

            req.body.hash = hash;

            //create new id for user
            req.body.id = uuid.v1();

            db.conn.none(sqlRegisterInsertUser, req.body)
              .then(function () {
                res.status(200)
                  .json({
                    token: tokenhandler.createToken(req.body.id)
                  });
              })
              .catch(function (err) {
                return next(err);
              });
          });
        }
        else {
          res.status(400)
          .json({
            message: 'User already exists or password is invalid.'
          });
        }
      }
      else {
        res.status(400)
          .json({
            message: 'User already exists or password is invalid.'
          });
      }
    })
    .catch(function (err) {
      return next(err);
    });
}

function login(req, res, next) {
  db.conn.oneOrNone(sqlRegisterCheckUser, req.body)
    .then(function (user) {
      if(user) {
        password(req.body.password).verifyAgainst(user.password, function(error, verified) {
          if(error)
              throw new Error('Something went wrong!');

          if(verified) {
            res.status(200)
            .json({
              token: tokenhandler.createToken(user.id)
            });
          }
          else {
              res.status(401)
              .json({
                message: 'Unknown user or bad password.'
              });
          }
        });
      }
      else {
        res.status(401)
          .json({
            message: 'Unknown user or bad password.'
          });

      }
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  register,
  login
};