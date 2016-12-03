var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

var listid;
var id1;
var id2;
var id3;


//clear the test schema before testing
describe('Items', () => {
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

              var list = {
                name: "newlist1"
              }

              chai.request(app)
                  .post('/api/lists/')
                  .set('x-access-token', token)
                  .send(list)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('id');
                      listid = res.body.id;
                    done();
                  });
          });
    });
  });

  describe('/GET items from empty List', () => {
    it('it should return no items', (done) => {
      chai.request(app)
          .get('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('items');
              res.body.items.should.be.a('array');
              res.body.items.length.should.be.eql(0);
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .get('/api/lists/'+listid+'/items')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .get('/api/lists/'+listid+'/items')
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
    it('it should create a new item', (done) => {
      var item = {
          name: "newitem1",
          checked: false,
          amount: 10.00,
          unit: 'stk'
      }
      chai.request(app)
          .post('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .send(item)
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
          .post('/api/lists/'+listid+'/items')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .post('/api/lists/'+listid+'/items')
          .set('x-access-token', "xyz")
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });
  });
    
  describe('/Get 3 items', () => {
    it('it should create a new item', (done) => {
      var item = {
          name: "newitem2",
          checked: false,
          amount: 15.00,
          unit: 'stk'
      }
      chai.request(app)
          .post('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .send(item)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              id2 = res.body.id;
            done();
          });
    });
    it('it should create a new item', (done) => {
      var item = {
          name: "newitem3",
          checked: false,
          amount: 1.50,
          unit: 'kg'
      }
      chai.request(app)
          .post('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .send(item)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              id3 = res.body.id;
            done();
          });
    });

    it('it should return 3 items', (done) => {
      chai.request(app)
          .get('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('items');
              res.body.items.should.be.a('array');
              res.body.items.length.should.be.eql(3);
            done();
          });
    });
  });

  describe('/PUT', () => {
    it('it should update an existing item', (done) => {
      var item = {
          id: id1,
          name: "newitem1Updated",
          checked: true,
          amount: 10.00,
          unit: 'stk'
      }
      chai.request(app)
          .put('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .send(item)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .put('/api/lists/'+listid+'/items')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .put('/api/lists/'+listid+'/items')
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
    it('it should delete an existing item', (done) => {
      var item = {
          id: id1
      }
      chai.request(app)
          .delete('/api/lists/'+listid+'/items')
          .set('x-access-token', token)
          .send(item)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            done();
          });
    });

    it('it should return 403 if no token provided', (done) => {
      chai.request(app)
          .delete('/api/lists/'+listid+'/items')
          .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
    });

    it('it should return 403 if no valid token provided', (done) => {
      chai.request(app)
          .delete('/api/lists/'+listid+'/items')
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