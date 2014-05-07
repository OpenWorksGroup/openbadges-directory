var Elastic    = require('../engine/elastic'),
    mysql      = require('mysql'),
    async      = require('async'),
    request    = require('request'),
    config     = require('../config'),
    logger     = require('../logger'),
    engine     = new Elastic(),
    connection = mysql.createConnection(config('DATABASE_URL'));
var INTERVAL = Number(config('INDEX_INTERVAL', 60000));


var indexIssuer = function (url, callback) {
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this endpoint = [' + url + ']');
//      return setTimeout(index, INTERVAL);
      callback(error || new Error());
    }

    var json    = JSON.parse(body),
        listing = json.badgelist;
    async.each(listing, function (badge, callback) {
      indexBadge(badge.location, callback);
    }, function complete(err) {
      logger.info('Finished indexing badges for issuer = [' + url + ']');
      callback(err);
    });
  });
};
var indexBadge = function (url, callback) {
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.info('There was an error trying to get this badge = [' + url + ']');
      callback(error || new Error());
    }

    var doc = JSON.parse(body);
    doc.location = url;
    engine.index(doc, function (err) {
      logger.info('Indexed badge = [' + body + ']' + (err ? ' failed. Err = [' + err + ']' : ''))

      callback(null, body);
    });
  });
};

var indexer = function () {
  connection.query('SELECT * FROM issuers WHERE indexed_at IS NULL OR (CURRENT_TIMESTAMP > (indexed_at + INTERVAL 60 SECOND))', function (err, rows) {
    logger.info('Found [' + rows.length + '] issuers needing to be indexed.');

    if (err) {
      logger.info('There was an error trying to retrieve available issuers.', err);
    }

    if (!rows.length) {
      return setTimeout(indexer, INTERVAL);
    }

//    engine.ping();

    async.each(rows, function (row, callback) {
      connection.query('UPDATE issuers SET indexed_at = CURRENT_TIMESTAMP WHERE ?', { id: row.id });
      indexIssuer(row.endpoint, function (err, result) {
        callback(null);
      });

    }, function complete(err) {
      logger.info('Status: ' + err);
      engine.refresh(function (err, body) {
        logger.info('Refreshed the search index' + (err ? ' with error = [' + err + ']' : '') + ' with body = [' + body + ']');
        return setTimeout(indexer, INTERVAL);
      });
    });
  });
};

setTimeout(indexer, INTERVAL);