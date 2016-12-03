var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

//clear the test schema before testing
describe('Users', () => {
  before((done) => {
      dbhandler.deleteUsers((err) => { 
         done();         
      });     
  });

  describe('/POST register', () => {
    it('it should register a new user', (done) => {
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
            done();
          });
    });

    it('it should not register an new user with a non matching password', (done) => {
      var user = {
          email: "newuser2",
          password: "newpa"
      }
      chai.request(app)
          .post('/api/users/register')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('User already exists or password is invalid.');
            done();
          });
    });

    it('it should not register a exisitng user', (done) => {
      var user = {
          email: "newuser",
          password: "newpassword"
      }
      chai.request(app)
          .post('/api/users/register')
          .send(user)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('User already exists or password is invalid.');
            done();
          });
    });
  });

  describe('/POST login', () => {
    it('it should login an existing user with correct password', (done) => {
      var user = {
          email: "newuser",
          password: "newpassword"
      }
      chai.request(app)
          .post('/api/users/login')
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
            done();
          });
    });

    it('it should not login an existing user with a false password', (done) => {
      var user = {
          email: "newuser",
          password: "wrongpassword"
      }
      chai.request(app)
          .post('/api/users/login')
          .send(user)
          .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Unknown user or bad password.');
            done();
          });
    });

    it('it should not login an not existing user', (done) => {
      var user = {
          email: "unknownuser",
          password: "wrongpassword"
      }
      chai.request(app)
          .post('/api/users/login')
          .send(user)
          .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Unknown user or bad password.');
            done();
          });
    });
  });
});