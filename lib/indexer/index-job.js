var async     = require('async'),
    request   = require('request'),
    logger    = require('../logger'),
    validator = require('../validator');
var safeParse = function (text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

function IndexJob(options) {
  this.indexEngine = options.engine;
}

IndexJob.prototype.indexBadgelist = function (url, callback) {
  var self = this;
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this endpoint = [' + url + ']');
      callback(error || new Error());
    }

    var json    = JSON.parse(body),
        listing = json.badgelist;
    async.each(listing, function (badge, callback) {
      self.indexBadge(url, badge.location, callback);
    }, function complete(err) {
      logger.info('Finished indexing badges for issuer = [' + url + ']');
      callback(err);
    });
  });
};

IndexJob.prototype.indexBadge = function (endpoint, url, callback) {
  var self = this;
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this badge = [' + url + ']');
      callback(error || new Error());
    }

    var doc = JSON.parse(body);
    doc._directory = {
      _location: url,
      _valid: validator(doc) === null,
      _endpoint: endpoint
    };
    self.indexIssuer(doc.issuer, function (error, issuerDoc) {
      if (error) {
        logger.info('Badge class at [' + doc._directory._location + '] is invalid because the issuer url could not be resolved');
      }
      if (issuerDoc && issuerDoc.name) {
        doc.issuerResolved = {name: issuerDoc.name};
      }
      
      if (issuerDoc.image) {
        doc.issuerResolved.image = issuerDoc.image;
      }
      
      if (issuerDoc.description) {
        doc.issuerResolved.description = issuerDoc.description;
      }
      
      if (issuerDoc.url) {
        doc.issuerResolved.url = issuerDoc.url;
      }

      self.indexEngine.index(doc, function (err) {
        logger.info('Indexed badge = [' + body + ']' + (err ? ' failed. Err = [' + err + ']' : ''))

        callback(null, body);
      });
    })
  });
};

IndexJob.prototype.indexIssuer = function (url, callback) {
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this issuer = [' + url + ']');
      callback(error || new Error());
    }

    return callback(null, safeParse(body)); //may not be valid json, which is ok. So don't blow up if it isn't
  });
};

exports.IndexJob = IndexJob;