var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

var id1;
var id2;
var id3;


//clear the test schema before testing
describe('Lists', () => {
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
    it('it should return no lists', (done) => {
      chai.request(app)
          .get('/api/lists')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('lists');
              res.body.lists.should.be.a('array');
              res.body.lists.length.should.be.eql(0);
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .get('/api/lists')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .get('/api/lists')
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
    it('it should create a new list', (done) => {
      var list = {
          name: "newlist1"
      }
      chai.request(app)
          .post('/api/lists')
          .set('x-access-token', token)
          .send(list)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              id1 = res.body.id;
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .post('/api/lists')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .post('/api/lists')
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });

  describe('/Get 3 lists', () => {
    it('it should create a new list', (done) => {
      var list = {
          name: "newlist2"
      }
      chai.request(app)
          .post('/api/lists')
          .set('x-access-token', token)
          .send(list)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              id2 = res.body.id;
            done();
          });
    });
    it('it should create a new list', (done) => {
      var list = {
          name: "newlist3"
      }
      chai.request(app)
          .post('/api/lists')
          .set('x-access-token', token)
          .send(list)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              id3 = res.body.id;
            done();
          });
    });

    it('it should return 3 lists', (done) => {
      chai.request(app)
          .get('/api/lists')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('lists');
              res.body.lists.should.be.a('array');
              res.body.lists.length.should.be.eql(3);
            done();
          });
    });
  });

  

  describe('/PUT', () => {
    it('it should update an existing list', (done) => {
      var list = {
          name: "newlist1Updated"
      }
      chai.request(app)
          .put('/api/lists/'+id1)
          .set('x-access-token', token)
          .send(list)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .put('/api/lists/'+id1)
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .put('/api/lists/'+id1)
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });

  describe('/DELETE', () => {
    it('it should delete an existing list', (done) => {
      chai.request(app)
          .delete('/api/lists/'+id1)
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .delete('/api/lists/'+id1)
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .delete('/api/lists/'+id1)
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