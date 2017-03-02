const path = require('path');
const https = require('https');
var solver = require('node-tspsolver')

const async = require('async');
const waterfall = require('async-waterfall');

const APIKEY = 'AIzaSyA9_9jLfoXHuOR7bdOTBrwNw6TG6IKymnw';

const apiUrl = 'maps.googleapis.com';
const apiPath = '/maps/api/distancematrix/json?';

function calculateRoute(startPosition, optimisationResult, callback)
{
   waterfall([                                      //use waterfall to be able to call error method in an easy way
    async.apply(getDistanceMatrix, startPosition, optimisationResult), //async.apply to hand over parameter to first method
    solveTSP,
    takeResults
  ], function (err) {
      if(!err) {
        callback(null);
      }
      else {
        callback(err);   
      }
  });
}

function getDistanceMatrix(startPosition, optimisationResult, callback)
{
  var actualPath;
  var locations = startPosition.latitude + ',' + startPosition.longitude;

  optimisationResult.markets.forEach(function(market) {
    locations += '|' + market.latitude + ',' + market.longitude;
  });

  actualPath = apiPath;
  actualPath += 'origins=';
  actualPath += locations;
  actualPath += '&destinations=';
  actualPath += locations;
  actualPath += '&key=';
  actualPath += APIKEY;

  var options = {
    host: apiUrl,
    port: 443,
    path: actualPath,
    method: 'GET',
    headers: {
      accept: '*/*'
    }
  };

  var req = https.request(options, function(res) {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      var distanceMatrix = JSON.parse(body);
      callback(null, optimisationResult, distanceMatrix);
    });
  });

  req.on('error', function(e) {
    callback(err);
  });

  req.end();
}

function solveTSP(optimisationResult, distanceMatrix, callback) {

  var costMatrix = _convertDistanceMatrixToCostMatrix(distanceMatrix);

  // optimumRoute is an array of indices specifying the route, first and last item is the startposition
  solver.solveTsp(costMatrix, true, {}, function (err, optimumRoute) {
    callback(null, optimisationResult, distanceMatrix, optimumRoute);
  });
}

function _convertDistanceMatrixToCostMatrix(distanceMatrix) {
  var costMatrix;

  costMatrix = distanceMatrix.rows.map(function(row) 
  {
    return row.elements.map(function(element) {
      return element.duration.value;
    });
  });

  return costMatrix;
}

function takeResults(optimisationResult, distanceMatrix, optimumRoute, callback)
{
  var actualDistance = 0;
  var actualMarket;

  //write distance from i to i+1 into i+1
  for (i = 0; i < (optimumRoute.length-1); i++) {
    actualDistance = distanceMatrix.rows[optimumRoute[i]].elements[optimumRoute[i+1]].distance.value; //lookupt distance from i (row) to i+1 column
    optimisationResult.distance += actualDistance;

    if(i != (optimumRoute.length-2)) { //if i == (optimumRoute.length-2 --> i+1 is startposition so it can't be set to a market
      actualMarket = optimisationResult.markets[optimumRoute[i+1]-1];//optimumRoute[i+1]-1: write distance in i+1, index has to be decreased, because startposition has index 0 in optimumRoute[]
      actualMarket.distanceTo = actualDistance;
      actualMarket.routePosition = i;
    }

  }

  //order markets by their routePosition ascending
  optimisationResult.markets.sort(function(a, b) {
    return parseFloat(a.routePosition) - parseFloat(b.routePosition);
  });

  callback(null);
}

module.exports = {
  calculateRoute: calculateRoute
};