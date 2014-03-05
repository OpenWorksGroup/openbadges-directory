//Inspired by thisandagain's badgecrawler - https://github.com/thisandagain/badgecrawler/blob/mozfest/lib/search.js
var Datastore = require('nedb'),
    lunr      = require('lunr'),
    _         = require('lodash');

function LunrIndex() {
  this.fullIndex = lunr(function () {
    this.field('name', 10);
    this.field('tags', 10);

    this.field('issuer', 5);
    this.field('image', 5);
    this.field('criteria', 5);

    this.field('description', 1);

    this.ref('location');
  });
  this.tagIndex = lunr(function () {
    this.field('tags', 10);
    this.ref('location');
  });
  this.db = new Datastore();
}

LunrIndex.prototype.index = function (document, callback) {
  //insert into nedb for searching on specific pieces
  this.fullIndex.add(document);
  this.tagIndex.add(document);
  this.db.insert(document, function (err, newDoc) {
    return callback(err, newDoc);
  });
};

LunrIndex.prototype.get = function get(id, callback) {
  this.db.findOne({location: id}).exec(callback);
};

LunrIndex.prototype.search = function search(options, callback) {
  var tags    = options.tags,
      q       = options.q,
      limit   = options.limit || 10,
      page    = options.page,
      dbQuery = {},
      results = [],
      tagRefs, cursor;

  if (q) {
    this.fullIndex.search(q).forEach(function (result) {
      results.push(result.ref);
    });
  }
  if (tags) {
    tagRefs = [];

    this.tagIndex.search(tags).forEach(function (result) {
      tagRefs.push(result.ref);
    });
    results = q ? _.intersection(results, tagRefs) : tagRefs;
  }

  results = _.unique(results);
  if (results.length) {
    dbQuery.location = {$in: results};
  } else if (!results.length && (q || tags)) {
    return callback(null, []);
  }

  cursor = this.db.find(dbQuery).limit(limit);
  if (page) {
    cursor = cursor.skip((limit * page) - limit);
  }
  if (!Object.keys(dbQuery).length) { //if we are doing a raw search, sort by insertion timestamp
    cursor = cursor.sort({ _indexed_at: -1 });
  }
  cursor.exec(callback);
};

module.exports = LunrIndex;
