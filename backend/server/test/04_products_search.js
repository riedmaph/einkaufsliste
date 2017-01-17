var path = require('path');


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var dbhandler = require(path.join('..', 'test', 'dbhandler', 'dbhandler'));

describe('Products/Search', () => {
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

  describe('/GET', () => {
    it('it should return no products for xyz', (done) => {
      chai.request(app)
          .get('/api/products/search?q=xyz')
          .set('x-access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('products');
            res.body.products.should.be.a('array');
            res.body.products.length.should.be.eql(0);
            done();
          });
    });
    it('it should return products for kokos', (done) => {
      chai.request(app)
          .get('/api/products/search?q=kokos')
          .set('x-access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('products');
            res.body.products.should.be.a('array');
            res.body.products.length.should.be.least(1);
            done();
          });
    });
  });
});