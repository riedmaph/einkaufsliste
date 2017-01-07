var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

var token;

//IDs hardcoded according to setUpMoveItems.sql
var listid = '5c7397aa-b249-11e6-b98b-000c29c17dad';
var itemIDs = {
  id1: '5c7397aa-b249-11e6-b98b-001c29c17dad',
  id2: '5c7397aa-b249-11e6-b98b-002c29c17dad',
  id3: '5c7397aa-b249-11e6-b98b-003c29c17dad',
  id4: '5c7397aa-b249-11e6-b98b-004c29c17dad',
  id5: '5c7397aa-b249-11e6-b98b-005c29c17dad',
}

function extactIDsFromJSON(data) {
  return Object.keys(data).map(
          function(key) {
              return data[key].id;
          });
}


//clear the test schema before testing
describe('Items MOVE', () => {

  beforeEach((done) => {
    var user = {
                email: "test@test.de",
                password: "testpass"
              }

    dbhandler.setUpMoveItems((err) => {   
      chai.request(app)
        .post('/api/users/login')
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

  describe('Create 5 items and move one up', () => {

    it('it should result in items being in the correct order', (done) => {

      var idsCorrect = [itemIDs.id1, itemIDs.id3, itemIDs.id4, itemIDs.id2, itemIDs.id5];

      var postions = {
        targetposition: 3
      }

      chai.request(app)
        .patch('/api/lists/'+listid+'/items/'+itemIDs.id2)
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
  
  describe('Create 5 items and move one down', () => {

    it('it should result in items being in the correct order', (done) => {

      var idsCorrect = [itemIDs.id1, itemIDs.id4, itemIDs.id2, itemIDs.id3, itemIDs.id5];

      var postions = {
        targetposition: 1
      }

      chai.request(app)
        .patch('/api/lists/'+listid+'/items/'+itemIDs.id4)
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

  describe('Create 5 items and move one up boundaries', () => {

    it('it should result in items being in the correct order', (done) => {

      var idsCorrect = [itemIDs.id2, itemIDs.id3, itemIDs.id4, itemIDs.id5, itemIDs.id1];

      var postions = {
        targetposition: 4
      }

      chai.request(app)
        .patch('/api/lists/'+listid+'/items/'+itemIDs.id1)
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

  describe('Create 5 items and move one down boundaries', () => {

    it('it should result in items being in the correct order', (done) => {

      var idsCorrect = [itemIDs.id5, itemIDs.id1, itemIDs.id2, itemIDs.id3, itemIDs.id4];

      var postions = {
        targetposition: 0
      }

      chai.request(app)
        .patch('/api/lists/'+listid+'/items/'+itemIDs.id5)
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