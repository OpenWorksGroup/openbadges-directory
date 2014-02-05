//Inspired by thisandagain's badgecrawler - https://github.com/thisandagain/badgecrawler/blob/mozfest/lib/search.js
var Datastore = require('nedb'),
    es        = require('event-stream'),
    fs        = require('fs'),
    lunr      = require('lunr');

function Search() {
  this.index = lunr(function () {
    this.field('name', 10);
    this.field('tags', 10);

    this.field('issuer', 5);
    this.field('image', 5);
    this.field('criteria', 5);

    this.field('description', 1);

    this.ref('_directory_uid');
  });
  this.db = new Datastore();
}

Search.prototype.load = function (file, loadCallback) {
  var self = this;
  fs.createReadStream(file)
    .pipe(es.split())
    .pipe(es.map(function (data, mapCallback) {
      // Strip empty lines
      if (data === '') {
        return;
      }
      var json = JSON.parse(data);
      json._directory_uid = json.name + json.issuer + (json.tags && json.tags.join(''));

      //add to the lunr index for full text searching
      self.index.add(json);

      //insert into nedb for searching on specific pieces
      self.db.insert(json, function (err, newDoc) {
        mapCallback(err, newDoc);
      });
    }))
    .pipe(es.wait(function (err) { //wait for all of the data to be inserted into nedb
      loadCallback(err);
    }));
};

/**
 * Takes a query object, which specifies characteristics about how we're going to search
 * {
 *   limit: int - max number of results
 * }
 */
Search.prototype.search = function (options, callback) {
  var limit    = options.limit || 10,
      tags     = options.tags,
      q        = options.q,
      name     = options.name,
      criteria = options.criteria,
      issuer   = options.issuer,
      query    = {};

  tags && (query.tags = {$in: tags});
  name && (query.name = {$regex: new RegExp(name, 'i')});
  criteria && (query.criteria = {$regex: new RegExp(criteria, 'i')});
  issuer && (query.issuer = {$regex: new RegExp(issuer, 'i')});
//  search against the lunr index, then filter down the results by the refs it returns
  if (q) {
    query._directory_uid = {$in:
      this.index.search(q).map(function (result) {
        return result.ref;
      })
    };
  }

  this.db.find(query).limit(limit).exec(function (err, docs) {
    //remove the _id and _directory_uid, since that's not relevant to the search results
    callback(err, docs && docs.map(function (doc) { delete doc._id; delete doc._directory_uid; return doc; }));
  });
};

//The main interface is a singleton, but we expose the constructor
// so it can also be instantiated manually
Search.prototype.Search = Search;

module.exports = new Search();
