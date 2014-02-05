/*global before*/

var restify = require('restify'),
    assert  = require('assert');

before(function(done) {
  require('../../lib/server')();
  done();
});