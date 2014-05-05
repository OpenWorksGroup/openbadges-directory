var dbm    = require('db-migrate'),
    type   = dbm.dataType,
    async  = require('async');

exports.up = function(db, callback) {
  async.parallel([
    function createListings(parallelCallback) {
      db.createTable('listings', {
        id: { type: type.INTEGER, primaryKey: 'true', autoIncrement: true },
        badge_class: type.TEXT
      }, parallelCallback);
    },
    function createIssuers(parallelCallback) {
      db.createTable('issuers', {
        id: { type: type.INTEGER, primaryKey: 'true' },
        name: type.STRING,
        description: type.STRING,
        endpoint: type.STRING,
        indexed_at: type.DATE_TIME,
        api_key: type.STRING
      }, parallelCallback);
    }
  ], function complete(error) {
    callback(error);
  });

};

exports.down = function(db, callback) {
  async.parallel([
    function dropListings(parallelCallback) {
      db.dropTable('listings', parallelCallback);
    },
    function dropIssuers(parallelCallback) {
      db.dropTable('issuers', parallelCallback);
    }
  ], function complete(error) {
    callback(error);
  })
};
