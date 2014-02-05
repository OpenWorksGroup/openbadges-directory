/*global describe, it, beforeEach*/

require('should');
var restify = require('restify'),
    assert  = require('assert'),
    client  = restify.createJSONClient({
      version: '*',
      url: 'http://localhost:9000'
    });

describe('yea', function () {
  describe('test it', function () {
    it('should return the first 10 results', function (done) {
      client.get('/search', function (err, req, res, data) {
        data.data.length.should.equal(10);
        done();
      })
    });

    it('should return results filtered by tag', function (done) {
      client.get('/search?tags=MOOC3,Badges', function (err, req, res, data) {
        data.data.length.should.equal(2);
        done();
      })
    });

    it('should return results filtered by tag', function (done) {
      client.get('/search?name=Badge+Pré+MOOC', function (err, req, res, data) {
        data.data.length.should.equal(1);
        done();
      })
    });

    it('should let you filter by multiple items', function (done) {
      client.get('/search?tags=Badges&issuer=https%3A%2F%2Fbadge.unow.fr%2Fapi%2Fv1%2Forganizations%2F1-unow-mooc-badges.json', function (err, req, res, data) {
        data.data.length.should.equal(1);
        done();
      });
    });
  });
});