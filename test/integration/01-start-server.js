/*global before*/

var restify = require('restify'),
    assert  = require('assert');

before(function(done) {
  process.env.BADGE_STORE = __dirname + '/../badges-small.json';
  process.env.API_KEY = 'TEST_API_KEY';
  require('../../lib/server')();
  done();
});