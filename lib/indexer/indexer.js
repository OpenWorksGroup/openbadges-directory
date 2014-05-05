var Elastic    = require('../engine/elastic'),
    mysql      = require('mysql'),
    async      = require('async'),
    rest       = require('restler'),
    config     = require('../config'),
    logger     = require('../logger'),
    engine     = new Elastic(),
    connection = mysql.createConnection(config('DATABASE_URL'));
var INTERVAL = 30000;

var getDoc = function (url) {

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

    engine.ping();

    rows.forEach(function (row) {
      connection.query('UPDATE issuers SET indexed_at = CURRENT_TIMESTAMP WHERE ?', { id: row.id });

      rest.get(row.endpoint).on('complete', function (result, response) {
        if (result instanceof Error || result.code) {
          logger.info('There was an error trying to get this endpoint = [' + row.endpoint + ']');
          return setTimeout(index, INTERVAL);
        }
        logger.info(result);
        return setTimeout(indexer, INTERVAL);
      });
    });
  });
};

setTimeout(indexer, INTERVAL);