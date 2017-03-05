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
var itemid1 = '5c7397aa-b249-11e6-b98b-001c29c17dad';
var itemid2 = '5c7397aa-b249-11e6-b98b-002c29c17dad';
var itemid3 = '5c7397aa-b249-11e6-b98b-003c29c17dad';
var itemid1 = '5c7397aa-b249-11e6-b98b-004c29c17dad';
var itemid5 = '5c7397aa-b249-11e6-b98b-005c29c17dad';

describe('Optimise', () => {
  before((done) => {
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

  describe('/Get optimised list by price', () => {
    it('it should return 5 items with 3 having offers', (done) => {
      chai.request(app)
          .get('/api/lists/'+listid+'/optimised?by=price&latitude=48.123320&longitude=11.612062')
          .set('x-access-token', token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('items');
              res.body.items.should.be.a('array');
              res.body.items.length.should.be.eql(5);
              res.body.items.should.deep.equal(
                [
                  {
                    "id": "5c7397aa-b249-11e6-b98b-001c29c17dad",
                    "position": 0,
                    "name": "Bananen",
                    "amount": 10,
                    "unit": "Stk",
                    "offerAlgorithm": null,
                    "offers": []
                  },
                  {
                    "id": "5c7397aa-b249-11e6-b98b-002c29c17dad",
                    "position": 1,
                    "name": "Hühnerfilet",
                    "amount": 350,
                    "unit": "g",
                    "offerAlgorithm": null,
                    "offers": []
                  },
                  {
                    "id": "5c7397aa-b249-11e6-b98b-003c29c17dad",
                    "position": 2,
                    "name": "Bier",
                    "amount": 3,
                    "unit": "Stk",
                    "offerAlgorithm": 738388,
                    "offers": [
                      {
                        "id": 738388,
                        "title": "Franziskaner Weissbier",
                        "market": 13395,
                        "offerprice": 10.99,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": "-30%",
                        "isOptimum": true,
                        "article": {
                          "name": "Weissbier",
                          "brand": "Franziskaner"
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      },
                      {
                        "id": 812347,
                        "title": "Mönchshof Original, Kellerbier oder Landbier",
                        "market": 13395,
                        "offerprice": 11.49,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": "-17%",
                        "isOptimum": false,
                        "article": {
                          "name": "Kellerbier",
                          "brand": "Mönchshof"
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      }
                    ]
                  },
                  {
                    "id": "5c7397aa-b249-11e6-b98b-004c29c17dad",
                    "position": 3,
                    "name": "Eier",
                    "amount": 10,
                    "unit": "Stk",
                    "offerAlgorithm": 738375,
                    "offers": [
                      {
                        "id": 738267,
                        "title": "ja! Frische Eier",
                        "market": 13395,
                        "offerprice": 1.19,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": null,
                        "isOptimum": false,
                        "article": {
                          "name": null,
                          "brand": null
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      },
                      {
                        "id": 738375,
                        "title": "Bernbacher Eiernudeln",
                        "market": 13395,
                        "offerprice": 0.55,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": "-35%",
                        "isOptimum": true,
                        "article": {
                          "name": null,
                          "brand": null
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      },
                      {
                        "id": 738414,
                        "title": "Teelichthalter/Eierbecher Elch*",
                        "market": 13395,
                        "offerprice": 3.33,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": null,
                        "isOptimum": false,
                        "article": {
                          "name": null,
                          "brand": null
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      },
                      {
                        "id": 802001,
                        "title": "ja! Eierspätzle",
                        "market": 16119,
                        "offerprice": 0.95,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": null,
                        "isOptimum": false,
                        "article": {
                          "name": "Eierspätzle",
                          "brand": "ja!"
                        },
                        "marketInfo": {
                          "id": 16119,
                          "name": "Baecker R. oHG Muenchen/Ramersdorf-Perla",
                          "street": "Melusinenstr. 2",
                          "zip": "81671",
                          "city": "München"
                        }
                      }
                    ]
                  },
                  {
                    "id": "5c7397aa-b249-11e6-b98b-005c29c17dad",
                    "position": 4,
                    "name": "Kaffee",
                    "amount": 150,
                    "unit": "g",
                    "offerAlgorithm": 812359,
                    "offers": [
                      {
                        "id": 802005,
                        "title": "Mövenpick Kaffee",
                        "market": 16119,
                        "offerprice": 3.88,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": "-38%",
                        "isOptimum": false,
                        "article": {
                          "name": "Kaffee",
                          "brand": "Mövenpick"
                        },
                        "marketInfo": {
                          "id": 16119,
                          "name": "Baecker R. oHG Muenchen/Ramersdorf-Perla",
                          "street": "Melusinenstr. 2",
                          "zip": "81671",
                          "city": "München"
                        }
                      },
                      {
                        "id": 812359,
                        "title": "Mövenpick Kaffee",
                        "market": 13395,
                        "offerprice": 3.88,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": "-38%",
                        "isOptimum": true,
                        "article": {
                          "name": "Kaffee",
                          "brand": "Mövenpick"
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      },
                      {
                        "id": 812365,
                        "title": "Dallmayr Kaffee-Pads",
                        "market": 13395,
                        "offerprice": 1.59,
                        "offerfrom": "2016-12-03T08:00:00.000Z",
                        "offerto": "2016-12-10T08:00:00.000Z",
                        "discount": "-20%",
                        "isOptimum": false,
                        "article": {
                          "name": "Kaffee",
                          "brand": "Dallmayr"
                        },
                        "marketInfo": {
                          "id": 13395,
                          "name": "Rewe-Markt GmbH",
                          "street": "Ritter-von-Schoch-Straße 19",
                          "zip": "84036",
                          "city": "Landshut"
                        }
                      }
                    ]
                  }
                ]);
            res.body.should.have.property('optimisationResult');
            res.body.optimisationResult.should.deep.equal(
              {
                "savings": 7.39,
                "distance": 161288,
                "markets": [
                  {
                    "id": 13395,
                    "name": "Rewe-Markt GmbH",
                    "latitude": 48.54623,
                    "longitude": 12.1799,
                    "street": "Ritter-von-Schoch-Straße 19",
                    "zip": "84036",
                    "city": "Landshut",
                    "shop": "REWE",
                    "distanceTo": 80523,
                    "routePosition": 1
                  }
                ]
              }
            );

            done();
          });
    });
  });
   
  describe('/PUT update item without offer', () => {
    it('it should update an item', (done) => {
      var item = {
          name: "Bier",
          amount: 3.00,
          unit: 'stk'
      }
      chai.request(app)
          .put('/api/lists/'+listid+'/optimised/'+itemid3+'?latitude=48.123320&longitude=11.612062')
          .set('x-access-token', token)
          .send(item)
          .end((err, res) => {
              res.body.should.be.a('object');
              res.body.should.deep.equal(
                {
                  "savings": 2.68,
                  "distance": 161288,
                  "markets": [
                    {
                      "id": 13395,
                      "name": "Rewe-Markt GmbH",
                      "latitude": 48.54623,
                      "longitude": 12.1799,
                      "street": "Ritter-von-Schoch-Straße 19",
                      "zip": "84036",
                      "city": "Landshut",
                      "shop": "REWE",
                      "distanceTo": 80523,
                      "routePosition": 1
                    }
                  ]
                }
              );
            done();
          });
    });
  });

  describe('/PUT update item with offer', () => {
    it('it should update an item', (done) => {
      var item = {
          name: "Kaffe Mövenpick",
          amount: 150.00,
          unit: 'g',
          userSelectedOffer: 802005
      }
      chai.request(app)
          .put('/api/lists/'+listid+'/optimised/'+itemid5+'?latitude=48.123320&longitude=11.612062')
          .set('x-access-token', token)
          .send(item)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.deep.equal(
                {
                  "savings": 2.68,
                  "distance": 162445,
                  "markets": [
                    {
                      "city": "München",
                      "distanceTo": 362,
                      "id": 16119,
                      "latitude": 48.12059,
                      "longitude": 11.6125,
                      "name": "Baecker R. oHG Muenchen/Ramersdorf-Perla",
                      "routePosition": 1,
                      "shop": "EDEKA",
                      "street": "Melusinenstr. 2",
                      "zip": "81671"
                    },
                    {
                      "id": 13395,
                      "name": "Rewe-Markt GmbH",
                      "latitude": 48.54623,
                      "longitude": 12.1799,
                      "street": "Ritter-von-Schoch-Straße 19",
                      "zip": "84036",
                      "city": "Landshut",
                      "shop": "REWE",
                      "distanceTo": 81318,
                      "routePosition": 2
                    }
                  ]
                }
              );
            done();
          });
    });
  });

  describe('/POST save optimisation', () => {
    it('it should update an item', (done) => {
      chai.request(app)
          .post('/api/lists/'+listid)
          .set('x-access-token', token)
          .send()
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
  });
});