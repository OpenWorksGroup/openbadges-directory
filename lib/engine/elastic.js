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
  this.client.get({
    index: 'badge_classes',
    type: 'badge_class',
    id: id
  }, function (err, response) {
    logger.info(response);
    callback(err, response && response._source);
  });
};

ElasticSearch.prototype.search = function search(options, callback) {
  var limit         = options.limit || 10,
      page          = options.page,
      searchOptions = {
        index: 'badge_classes',
        type: 'badge_class',
        from: (page && ((limit * page) - limit)) || 0,
        size: limit,
        //all queries default to returning documents that are considered valid according to the badge class spec
        body: {
          query: {
            bool: {
              must: [{
                term: {
                  '_directory._valid': true
                }
              }]
            }
          }
        }
      };

  if (options.q) {
    searchOptions.body.query.bool.must.push({
      query_string: {
        query: options.q + '*'
      }
    });
  }
  if (options.tags) {
    searchOptions.body.query.bool.must.push({
      query_string: {
        default_field: 'tags',
        query: options.tags.map(function (tag) { return tag + '*'; }).join(' ')
      }
    });
  }
  this.client.search(searchOptions, function (err, response) {
    callback(err,
      response &&
      response.hits &&
      response.hits.hits.map(function (hit) {
        return hit._source;
      }));
  });
};

ElasticSearch.prototype.index = function (document, callback) {
  this.client.index({
    index: 'badge_classes',
    type: 'badge_class',
    id: document._directory._location,
    body: document
  }, function (err, response) {
    logger.info(response);
    callback(err);
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
