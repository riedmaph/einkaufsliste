var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));


//clear the test schema before testing
describe('Favourite-Markets', () => {
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

  describe('/GET empty DB', () => {
    it('it should return no markets', (done) => {
      chai.request(app)
          .get('/api/markets/favourites')
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
          .get('/api/markets/favourites')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .get('/api/markets/favourites')
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });

  describe('/POST', () => {
    it('it should add a market to favourites', (done) => {
      chai.request(app)
          .post('/api/markets/favourites/1')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .post('/api/markets/favourites/1')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .post('/api/markets/favourites/1')
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });

  describe('/GET 3 markets', () => {
   it('it should add a market to favourites', (done) => {
      chai.request(app)
          .post('/api/markets/favourites/2')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });

    it('it should add a market to favourites', (done) => {
      chai.request(app)
          .post('/api/markets/favourites/3')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });

    it('it should return 3 lists', (done) => {
      chai.request(app)
          .get('/api/markets/favourites')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('markets');
              res.body.markets.should.be.a('array');
              res.body.markets.length.should.be.eql(3);
            done();
          });
    });
  });

  describe('/DELETE', () => {
    it('it should delete an existing list', (done) => {
      chai.request(app)
          .delete('/api/markets/favourites/2')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .delete('/api/markets/favourites/2')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .delete('/api/markets/favourites/2')
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