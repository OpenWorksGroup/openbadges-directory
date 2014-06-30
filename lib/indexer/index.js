var Elastic       = require('../engine/elastic'),
    mysql         = require('mysql'),
    async         = require('async'),
    request       = require('request'),
    config        = require('../config'),
    logger        = require('../logger'),
    validator     = require('../validator'),
    IndexJob      = require('./index-job').IndexJob,
    engine        = new Elastic(),
    connection    = mysql.createConnection(config('DATABASE_URL')),
    indexInterval = Number(config('INDEX_INTERVAL', 60000)),
    queryInterval = config('QUERY_INTERVAL', '1 HOUR');

var VALID_QUERY_INTERVALS = ['5 SECOND', '1 MINUTE', '1 HOUR', '1 DAY'];
if (VALID_QUERY_INTERVALS.indexOf(queryInterval) === -1) {
  queryInterval = '1 HOUR';
}

//takes all endpoint rows and tries to index them, if necessary
var getAndIndexEndpoints = function (err, rows) {
  logger.info('Found [' + ((rows && rows.length) || 0) + '] endpoints needing to be indexed.');

  if (err) {
    logger.info('There was an error trying to retrieve available endpoints.', err);
  }

  if (!rows.length) {
    return setTimeout(main, indexInterval);
  }

  async.each(rows, function (row, callback) {
    var job = new IndexJob({ engine: engine });
    job.indexBadgelist(row.endpoint, function (err, result) {
      callback(null);
    });

    connection.query('UPDATE endpoints SET indexed_at = CURRENT_TIMESTAMP WHERE ?', { id: row.id });
  }, function complete(err) {
    logger.info('Status: ' + err);
    engine.refresh(function (err, body) {
      logger.info('Refreshed the search index' + (err ? ' with error = [' + err + ']' : '') + ' with body = [' + body + ']');
      return setTimeout(main, indexInterval);
    });
  });
};

//main entry point
var main = function () {
  engine.indexExists(function (error, indexExists) {
    if (error) { //if there's an error, just try again...
      return setTimeout(main, indexInterval);
    }
    if (!indexExists) { //if the index doesn't exist, create it, then try again...
      return engine.createIndex(function (error) {
        setTimeout(main, indexInterval);
      });
    }

    connection.query( //find all endpoints and attempt to index them
      'SELECT * FROM endpoints WHERE indexed_at IS NULL OR (CURRENT_TIMESTAMP > (indexed_at + INTERVAL ' + queryInterval + '))',
      getAndIndexEndpoints);
  });
};

setTimeout(main, indexInterval);