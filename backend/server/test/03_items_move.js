var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

var token;
var listid;
var id1;
var id2;
var id3;
var id4;
var id5;

function createItem(name) {
  var id;

  it('it should create a new item', (done) => {
    var item = {
        name: name,
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
            id = res.body.id;
          done();
        });
  });

  return id;
}

function extactIDsFromJSON(data) {
  return Object.keys(data).map(
          function(key) {
              return data[key].id;
          });
}


//clear the test schema before testing
describe('Items MOVE', () => {

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

  describe('/Create 5 items and move them arround', () => {

    id1 = createItem("newitem1");
    id2 = createItem("newitem2");
    id3 = createItem("newitem3"); 
    id4 = createItem("newitem4"); 
    id5 = createItem("newitem5");

    it('it should move an item up', (done) => {

      var idsCorrect = [1, 2, 4, 5, 3];

      var postions = {
        from: 2,
        to: 4,
      }

      chai.request(app)
          .put('/api/lists/'+listid+'/items/move')
          .set('x-access-token', token)
          .send(postions)
          .end((err, res) => {

            dbhandler.getIdsOrderedByPositionList(listid, (data) => {
              res.should.have.status(200);
              res.body.should.be.a('object'); 

              var idsActual = extactIDsFromJSON(data);
              
              idsActual.should.be.eql(idsCorrect);

              done();
            });     

          });
    });

    it('it should move an item down', (done) => {

      var idsCorrect = [1, 2, 3, 4, 5];

      var postions = {
        from: 4,
        to: 2,
      }

      chai.request(app)
          .put('/api/lists/'+listid+'/items/move')
          .set('x-access-token', token)
          .send(postions)
          .end((err, res) => {

            dbhandler.getIdsOrderedByPositionList(listid, (data) => {
              res.should.have.status(200);
              res.body.should.be.a('object'); 

              var idsActual = extactIDsFromJSON(data);
              
              idsActual.should.be.eql(idsCorrect);

              done();
            });     

          });
    });

    it('it should move an item up, boundaries', (done) => {

      var idsCorrect = [5, 1, 2, 3, 4];

      var postions = {
        from: 4,
        to: 0,
      }

      chai.request(app)
          .put('/api/lists/'+listid+'/items/move')
          .set('x-access-token', token)
          .send(postions)
          .end((err, res) => {

            dbhandler.getIdsOrderedByPositionList(listid, (data) => {
              res.should.have.status(200);
              res.body.should.be.a('object'); 

              var idsActual = extactIDsFromJSON(data);
              
              idsActual.should.be.eql(idsCorrect);

              done();
            });     

          });
    });

    it('it should move an item down, boundaries', (done) => {

      var idsCorrect = [1, 2, 3, 4, 5];

      var postions = {
        from: 0,
        to: 4,
      }

      chai.request(app)
          .put('/api/lists/'+listid+'/items/move')
          .set('x-access-token', token)
          .send(postions)
          .end((err, res) => {

            dbhandler.getIdsOrderedByPositionList(listid, (data) => {
              res.should.have.status(200);
              res.body.should.be.a('object'); 

              var idsActual = extactIDsFromJSON(data);
              
              idsActual.should.be.eql(idsCorrect);

              done();
            });     

          });
    });

  });

});