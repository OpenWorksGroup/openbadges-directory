var elasticsearch = require('elasticsearch'),
    request       = require('request'),
    logger        = require('../logger'),
    config        = require('../config');

function ElasticSearch() {
  this.client = new elasticsearch.Client({
    host: config('ES_HOST', 'http://localhost:9200'),
    log: 'trace'
  });
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
    index: 'badge_classes',
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

ElasticSearch.prototype.deleteIndex = function (callback) {
  //curl -XDELETE 'http://localhost:9200/twitter/'
  request({
    method: 'DELETE',
    uri: config('ES_HOST', 'http://localhost:9200') + '/badge_classes/'
  }, function (error, response, body) {
    if (response.statusCode !== 200) {
      return callback(new Error('There was an issue deleting the index: ' + body));
    }
    return callback(null, body);
  });
};

ElasticSearch.prototype.refresh = function (callback) {
  //curl -XPOST 'http://localhost:9200/twitter/_refresh'
  request({
    method: 'POST',
    uri: config('ES_HOST', 'http://localhost:9200') + '/badge_classes/_refresh'
  }, function (error, response, body) {
    if (response.statusCode !== 200) {
      return callback(new Error('There was an issue refreshing the index: ' + body));
    }
    return callback(null, body);
  });
};

module.exports = ElasticSearch;
