var async     = require('async'),
    request   = require('request'),
    logger    = require('../logger'),
    validator = require('../validator');

function IndexJob(options) {
  this.indexEngine = options.engine;
}

IndexJob.prototype.indexIssuer = function (url, callback) {
  var self = this;
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this endpoint = [' + url + ']');
      callback(error || new Error());
    }

    var json    = JSON.parse(body),
        listing = json.badgelist;
    async.each(listing, function (badge, callback) {
      self.indexBadge(badge.location, callback);
    }, function complete(err) {
      logger.info('Finished indexing badges for issuer = [' + url + ']');
      callback(err);
    });
  });
};

IndexJob.prototype.indexBadge = function (url, callback) {
  var self = this;
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this badge = [' + url + ']');
      callback(error || new Error());
    }

    var doc = JSON.parse(body);
    doc._directory = {
      _location: url,
      _valid: validator(doc) === null
    };
    self.indexEngine.index(doc, function (err) {
      logger.info('Indexed badge = [' + body + ']' + (err ? ' failed. Err = [' + err + ']' : ''))

      callback(null, body);
    });
  });
};

exports.IndexJob = IndexJob;