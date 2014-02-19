/*global describe, it, beforeEach*/
var should = require('should'),
    util   = require('../../lib/util');

describe('util', function () {
  describe('#parseSearch', function () {
    it('parses out the pieces of the query', function () {
      var all      = util.parseSearch({ query: { tags: 'item1,item2', q: 'search' }}),
          tagsOnly = util.parseSearch({ query: { tags: 'item3,item4' }}),
          qOnly    = util.parseSearch({ query: { q: 'search' }});
      all.tags.length.should.equal(2);
      all.q.should.equal('search');

      tagsOnly.tags.length.should.equal(2);
      should.not.exist(tagsOnly.q);

      should.not.exist(qOnly.tags);
      qOnly.q.should.equal('search');
    });

    it('validates the limit', function () {
      var negative = util.parseSearch({ query: { limit: '-10' } }),
          tooLarge = util.parseSearch({ query: { limit: '1020' } }),
          invalid  = util.parseSearch({ query: { limit: 'kaefijaef' } }),
          valid    = util.parseSearch({ query: { limit: '22' } });

      negative.limit.should.equal(10);
      tooLarge.limit.should.equal(100);
      invalid.limit.should.equal(10);
      valid.limit.should.equal(22);
    });
  });
});