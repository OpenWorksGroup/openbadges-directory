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

    it('should find results', function (done) {
      search.search({}, function (err, result) {
        result.should.eql([]);
        done();
      });
    })
  })
});