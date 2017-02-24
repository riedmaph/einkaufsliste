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

describe('Optimise', () => {

  beforeEach((done) => {
    var user = {
                email: "test@test.de",
                password: "testpass"
              }

    dbhandler.setOptimisation((err) => {   
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

  describe('/Get optimised list', () => {
    it('it should return 5 items with 3 having offers', (done) => {
      chai.request(app)
          .get('/api/lists/'+listid+'/optimised')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('items');
              res.body.items.should.be.a('array');
              res.body.items.length.should.be.eql(5);
              res.body.items[0].should.have.property('offers');
              res.body.items[0].offers.should.be.a('array');
              res.body.items[0].offers.length.should.be.eql(0);
              res.body.items[1].should.have.property('offers');
              res.body.items[1].offers.should.be.a('array');
              res.body.items[1].offers.length.should.be.eql(0);
              res.body.items[2].should.have.property('offers');
              res.body.items[2].offers.should.be.a('array');
              res.body.items[2].offers.length.should.be.eql(2);
              res.body.items[3].should.have.property('offers');
              res.body.items[3].offers.should.be.a('array');
              res.body.items[3].offers.length.should.be.eql(1);
              res.body.items[4].should.have.property('offers');
              res.body.items[4].offers.should.be.a('array');
              res.body.items[4].offers.length.should.be.eql(3);
            done();
          });
    });
  });
});