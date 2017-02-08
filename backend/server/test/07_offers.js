var path = require('path');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

describe('Markets', () => {
  var token;

  before((done) => {    
    dbhandler.deleteUsers((err) => {
      var user = {
        email: "newuser",
        password: "newpassword"
      }
      chai.request(app)
          .post('/api/users/register')
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              token = res.body.token;
            done();
          });
    });
  }); 

  describe('/GET offers for Edeka Häfner', () => {
    it('it should return more than 5 offers', (done) => {
      chai.request(app)
          .get('/api/markets/5084/offers')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('offers');
              res.body.offers.should.be.a('array');
              res.body.offers.length.should.be.above(5);
            done();
          });
    });

     it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .get('/api/markets/5084/offers')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .get('/api/markets/5084/offers')
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });
});