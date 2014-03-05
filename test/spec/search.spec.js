/*global describe, it, beforeEach*/
require('should');
var Search    = require('../../lib/search').Search,
    badgePath = __dirname + '/../badges-small.json';


describe('Search', function () {
  describe('#load', function () {
    it('should trigger the callback after loading', function (done) {
      var search = new Search();
      search.load(badgePath, function (err) {
        done(err);
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
        done(err);
      });
    });

    it('should allow limits', function (done) {
      search.search({ limit: 2 }, function (err, result) {
        result.length.should.equal(2);
        done(err);
      });
    });

    it('lets you search by tags', function (done) {
      search.search({ tags: ['etc', 'education'] }, function (err, result) {
        result.length.should.equal(1);

        var firstResult = result[0];
        firstResult.tags.should.eql(['education', 'etc']);
        firstResult.name.should.equal('CEM Member');
        firstResult.image.should.equal('http://badger.connectededucators.org/badge/image/cem-member.png');

        done(err);
      });
    });

    it('searches on all available data', function (done) {
      search.search({ q: 'MOOC GdP' }, function (err, result) {
        result.length.should.equal(3);
        done(err);
      });
    });

    it('searches on all available data, additionally filtering by tags', function (done) {
      search.search({ q: 'démontré', tags: ['MOOC3', 'Badges'] }, function (err, result) {
        result.length.should.equal(1);
        done(err);
      });
    });
  });

  describe('#get', function () {
    var search;
    beforeEach(function (done) {
      search = new Search();
      search.load(badgePath, done);
    });

    it('get by location', function (done) {
      search.get('http://www.no-reply.com/12', function (err, result) {
        result.location.should.equal('http://www.no-reply.com/12');
        done(err);
      });
    });
  });
});