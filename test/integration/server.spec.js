/*global describe, it, beforeEach*/

require('should');
var restify = require('restify'),
    assert  = require('assert'),
    client  = restify.createJSONClient({
      version: '*',
      url: 'http://localhost:9000'
    }),
    async = require('async');
client.basicAuth('TEST_API_KEY', '');

var isSorted = function (list) {
  var sorted = true,
      last;
  list.forEach(function (item) {
    if (last && item._indexed_at > last) {
      sorted = false;
    }
    last = item._indexed_at;
  });
  return sorted;
};

describe('Search API', function () {
  describe('/search', function () {
    it('should return the first 10 results', function (done) {
      client.get('/search', function (err, req, res, data) {
        data.data.length.should.equal(10);
        done();
      });
    });

    it('returns results by recency if no search criteria are specified', function (done) {
      client.get('/search', function (err, req, res, data) {
        isSorted(data.data).should.equal(true);
        done();
      });
    });

    it('limits number of return values by the limit param', function (done) {
      client.get('/search?limit=14', function (err, req, res, data) {
        data.data.length.should.equal(14);
        client.get('/search?limit=7', function (err, req, res, data) {
          data.data.length.should.equal(7);
          done();
        });
      });
    });

    it('allows pagination using the page and limit params', function (done) {
      client.get('/search?limit=10&page=2', function (err, req, res, data) {
        data.data.length.should.equal(10);
        client.get('/search?limit=10&page=3', function (err, req, res, data) {
          data.data.length.should.equal(2);
          done();
        });
      });
    });

    it('should return results filtered by tag', function (done) {
      client.get('/search?tags=MOOC3,Badges', function (err, req, res, data) {
        data.data.length.should.equal(1);
        done();
      });
    });

    it('should let you filter by multiple items', function (done) {
      client.get('/search?tags=Badges&q=https://badge.unow.fr/api/v1/organizations/1-unow-mooc-badges.json', function (err, req, res, data) {
        data.data.length.should.equal(1);
        done();
      });
    });
  });

  describe('/recent', function () {
    it('should return recent badges', function (done) {
      client.get('/recent?limit=10&page=3', function (err, req, res, data) {
        data.data.length.should.equal(2);
        done();
      });
    });
  });

  describe('/get badge by location', function () {
    it('should allow getting a badge the badge url', function (done) {
      client.get('/' + encodeURIComponent('http://www.no-reply.com/12'), function (err, req, res, data) {
        data.data.location.should.equal('http://www.no-reply.com/12');
        done();
      });
    });
  });

  describe('verify the api key', function () {
    var apiClient = restify.createJSONClient({
      version: '*',
      url: 'http://localhost:9000'
    });

    it('should block all api calls without a key', function (done) {
      async.each([
        '/' + encodeURIComponent('http://www.no-reply.com/12'),
        '/recent',
        '/search?tags=MOOC3,Badges'
      ], function (url, callback) {
        apiClient.get(url, function (err) {
          if (!err) {
            return callback(new Error('All api calls without a key should fail'));
          }
          err.message.should.equal('API Key required');
          err.statusCode.should.equal(401);
          callback();
        });
      }, function (err) {
        done(err);
      })
    })
  });
});