const path = require('path');
var jwt = require('jsonwebtoken');

const db = require(path.resolve(__dirname, './dbconnector.js'));
var sqlCheckAdminUser = db.loadSql(path.join('controllers', 'users', 'checkAdminUser.sql'));


const config = {
  tokenSecret: 'supersicher',
  tokenExpiresIn: '14 days',
}

function createToken(userid) {

	var token = jwt.sign({'userid': userid}, config.tokenSecret, {
    expiresIn: config.tokenExpiresIn // expires in 24 hours
  });

	return token;
}

//middleware function to verify token
function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.tokenSecret, function(err, decoded) {      
      if (err) {
        res.status(403)
          .json({
            message: 'Failed to authenticate token.'
          });
      } else {
        // if everything is good, save to request for use in other routes
        req.body.userid = decoded.userid;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'Failed to authenticate token.' 
    });
    
  }
};

//middleware function to verify token
function verifyAdminToken(req, res, next) {
  verifyToken(req,res,() => {
    db.conn.one(sqlCheckAdminUser,req.body)
      .then(() => {
        req.body.isAdmin = true;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(403)
          .json({
            message: 'Failed to authenticate as admin.'
          });
      });
  });
};

module.exports = {
	createToken,
  verifyAdminToken,
  verifyToken
};
