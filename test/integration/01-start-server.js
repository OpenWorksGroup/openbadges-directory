/*global before*/

var restify = require('restify'),
    assert  = require('assert');

before(function(done) {
  process.env.BADGE_STORE = __dirname + '/../badges-small.json';
  require('../../lib/server')();
  done();
});