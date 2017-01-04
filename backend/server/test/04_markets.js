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

  describe('/GET markets for Franz Wolter Strasse in 100m', () => {
    it('it should return no markets', (done) => {
      chai.request(app)
          .get('/api/markets/search?latitude=48.174805&longditude=11.633389&max-distance=100')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('markets');
              res.body.markets.should.be.a('array');
              res.body.markets.length.should.be.eql(0);
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .get('/api/markets/search?latitude=48.174805&longditude=11.633389&max-distance=100')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .get('/api/markets/search?latitude=48.174805&longditude=11.633389&max-distance=100')
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });

  describe('/GET markets for Franz Wolter Strasse in 240m', () => {
    it('it should return one market', (done) => {
      chai.request(app)
          .get('/api/markets/search?latitude=48.174805&longditude=11.633389&max-distance=240')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('markets');
              res.body.markets.should.be.a('array');
              res.body.markets.length.should.be.eql(1);
              res.body.markets[0].should.be.a('object');
              res.body.markets[0].should.have.property('name');
              res.body.markets[0].name.should.be.eql('EDEKA Häfner');
            done();
          });
    });
  });

  describe('/GET markets for Franz Wolter Strasse in 250m', () => {
    it('it should return two markets', (done) => {
      chai.request(app)
          .get('/api/markets/search?latitude=48.174805&longditude=11.633389&max-distance=250')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('markets');
              res.body.markets.should.be.a('array');
              res.body.markets.length.should.be.eql(2);
              res.body.markets.map(function(a) {return a.name;}).should.have.members(['EDEKA Häfner', 'Marktkauf Unterföhring']);
            done();
          });
    });
  });
});