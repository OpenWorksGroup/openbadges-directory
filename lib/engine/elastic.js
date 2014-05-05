var elasticsearch = require('elasticsearch');

function ElasticSearch() {
  this.client = new elasticsearch.Client({
    log: 'trace'
  });
}

ElasticSearch.prototype.get = function get(id, callback) {
  this.db.findOne({location: id}).exec(callback);
};

ElasticSearch.prototype.search = function search(options, callback) {

};

ElasticSearch.prototype.index = function (document, callback) {
  this.client.index({
    index: 'badgeClass',
    type: 'badgeClass',
    id: document.location,
    body: document
  }).then(function (resp) {
    console.log(resp);
  }).error(function (error) {
    console.log(error);
  });
};

module.exports = ElasticSearch;
