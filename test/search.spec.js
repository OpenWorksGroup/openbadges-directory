/*global describe, it, beforeEach*/
require('should');
var Search    = require('../lib/search').Search,
    badgePath = __dirname + '/badges-small.json';


describe('Search', function () {
  describe('#load', function () {
    it('should trigger the callback after loading', function (done) {
      var search = new Search();
      search.load(badgePath, function (err) {
        if (err) { return done(err); }
        done();
      });
    });
  });

  describe('#search', function () {
    var search;
    beforeEach(function (done) {
      search = new Search();
      search.load(badgePath, done);
    });

    it('returns the first 10 results with a no arg search', function (done) {
      search.search({}, function (err, result) {
        result.length.should.equal(10);
        done();
      });
    });

    it('should allow limits', function (done) {
      search.search({ limit: 2 }, function (err, result) {
        result.length.should.equal(2);
        done();
      });
    });
  });
});