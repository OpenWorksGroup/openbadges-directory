var elasticsearch = require('elasticsearch'),
    logger        = require('../logger'),
    config        = require('../config');

function ElasticSearch() {
  this.client = new elasticsearch.Client({
    host: config('ES_HOST', 'http://localhost:9200'),
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

ElasticSearch.prototype.ping = function () {
  this.client.ping({
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      logger.info('elasticsearch cluster is down!');
    } else {
      logger.info('All is well');
    }
  });
};

module.exports = ElasticSearch;
