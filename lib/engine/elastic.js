var elasticsearch = require('elasticsearch'),
    logger        = require('../logger');

function ElasticSearch() {
  this.client = new elasticsearch.Client({
    log: 'trace'
  });
//  this.client.deleteIndex
}

ElasticSearch.prototype.get = function get(id, callback) {
  this.db.findOne({location: id}).exec(callback);
};

ElasticSearch.prototype.search = function search(options, callback) {
  this.client.search({
    index: 'badge_class',
    type: 'badge_class',
    q: '*o*'
//    body: {
//      query: {
//        match: {
//          body: 'o'
//        }
//      }
//    }
  }).then(function (resp) {
    logger.info(resp);
    callback(resp);
  }, function (err) {
    logger.info(err);
    callback(err);
  });
};

ElasticSearch.prototype.index = function (document, callback) {
  this.client.index({
    index: 'badge_class',
    type: 'badge_class',
//    id: document.location,
    body: document
  }).then(function (resp) {
    logger.info(resp);
    callback();
  }).error(function (error) {
    logger.info(error);
    callback(error);
  });
};

module.exports = ElasticSearch;
