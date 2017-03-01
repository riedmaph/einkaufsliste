const path = require('path');

const uuid = require('uuid');
const password = require('password-hash-and-salt');

const db = require(path.join('..', 'dbconnector.js'));
const tokenhandler = require(path.join('..', 'tokenhandler'));

const logger = require(path.join('..', '..', 'logging', 'logger'));

var sqlRegisterCheckUser = db.loadSql(path.join('controllers', 'users', 'registerCheckUser.sql'));
var sqlRegisterInsertUser = db.loadSql(path.join('controllers', 'users', 'registerInsertUser.sql'));

var sqlCreateList = db.loadSql(path.join('controllers', 'lists', 'createList.sql'));
var sqlUpdateRecentList = db.loadSql(path.join('controllers', 'lists', 'updateRecentList.sql'));

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
                // the user does not want to know about default list generation, thus send the response first
                res.status(200)
                  .json({
                    token: tokenhandler.createToken(req.body.id)
                  });
                const newList = {
                  id: uuid.v1(),
                  userid: req.body.id,
                  name: 'Einkaufsliste',
                };
                db.conn.none(sqlCreateList, newList)
                  .then(function () {
                    db.conn.any(sqlUpdateRecentList, { userid: newList.userid, listid: newList.id })
                      .then(function () { })
                      .catch(function (err) {
                        // the user does not want to know about this
                        logger.log('error','controllers.users.register.sqlUpdateRecentList: ' + err.message);
                    });
                  })
                  .catch(function (err) {
                    logger.log('error','controllers.users.register.sqlCreateList: ' + err.message);
                  });
              })
              .catch(function (err) {
                err.message = 'controllers.users.register.sqlRegisterInsertUser: ' + err.message;
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
      err.message = 'controllers.users.register.sqlRegisterCheckUser: ' + err.message;
      return next(err);
    });
}

function login(req, res, next) {
  db.conn.oneOrNone(sqlRegisterCheckUser, req.body)
    .then(function (user) {
      if(user) {
        password(req.body.password).verifyAgainst(user.password, function(error, verified) {
          if(error) {
            err.message = 'controllers.users.login.verifypassword: ' + err.message;
            return next(error);
          }

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
      err.message = 'controllers.users.login.sqlRegisterCheckUser: ' + err.message;
      return next(err);
    });
}

module.exports = {
  register: register,
  login: login
};
