//initially inspired by thisandagain's badgecrawler - https://github.com/thisandagain/badgecrawler/blob/mozfest/lib/search.js
//it only used lunrjs, which was more simplistic in its search capability.
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

    this.ref('name');
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

Search.prototype.search = function (options, callback) {
  console.log(options);
  return callback(null, []);
};

//The main interface is a singleton, but we expose the constructor
// so it can also be instantiated manually
Search.prototype.Search = Search;

module.exports = new Search();
