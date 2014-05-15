//Inspired by thisandagain's badgecrawler - https://github.com/thisandagain/badgecrawler/blob/mozfest/lib/search.js
var es          = require('event-stream'),
    fs          = require('fs'),
    SearchIndex = require('./engine/index');

function Search() {
  this.searchIndex = new SearchIndex();
}

Search.prototype.load = function (file, loadCallback) {
//  var self = this;
//  fs.createReadStream(file)
//    .pipe(es.split())
//    .pipe(es.map(function (data, mapCallback) {
      // Strip empty lines
//      if (data === '') {
//        return;
//      }
//      var json = JSON.parse(data);
//      json._indexed_at = Date.now();

      //add to the index for full text searching
//      self.searchIndex.index(json, function (err, newDoc) {
//        mapCallback(err, newDoc);
//      });
//    }))
//    .pipe(es.wait(function (err, data) { //wait for all of the data to be inserted into nedb
//      loadCallback(err, data);
//    }));
  loadCallback();
};

Search.prototype.delete = function (callback) { return this.searchIndex.deleteIndex(callback); };
Search.prototype.refresh = function (callback) { return this.searchIndex.refresh(callback); };

/**
 * Takes a query object, which specifies characteristics about how we're going to search
 * {
 *   limit: int - max number of results,
 *   tags: array - array of possible tags,
 *   q: string - full search string against the full index
 * }
 */
Search.prototype.search = function (options, callback) {
  options.limit = (options.limit || 10);
  this.searchIndex.search(options, function (err, docs) {
    //remove the _id and since that's not relevant to the search results
    return callback(err, docs && docs.map(function (doc) {
      delete doc._id;
//      delete doc._indexed_at;
      return doc;
    }));
  });
};

Search.prototype.get = function (id, callback) {
  return this.searchIndex.get(id, function (err, doc) {
    doc && (delete doc._id);
    return callback(err, doc);
  });
};

//The main interface is a singleton, but we expose the constructor
// so it can also be instantiated manually
Search.prototype.Search = Search;

module.exports = new Search();
