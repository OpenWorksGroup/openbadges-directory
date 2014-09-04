var dbm    = require('db-migrate'),
    type   = dbm.dataType,
    async  = require('async');

exports.up = function(db, callback) {
  async.parallel([
    function createEndpoints(parallelCallback) {
      db.createTable('endpoints', {
        id: { type: type.INTEGER, primaryKey: 'true', autoIncrement: true },
        name: type.STRING,
        organization: type.STRING,
        website: type.STRING,
        description: type.STRING,
        endpoint: type.STRING,
        indexed_at: type.DATE_TIME,
        contact_email: type.STRING
      }, parallelCallback);
    }
//    function createApiKeys(parallelCallback) {
//      db.createTable('api_keys', {
//        id: { type: type.INTEGER, primaryKey: 'true' },
//        name: type.STRING,
//        description: type.STRING,
//        website: type.STRING,
//        api_key: type.STRING
//      }, parallelCallback);
//    }
  ], function complete(error) {
    if (error) {
      return callback(error);
    }
    //create the index so endpoints are unique
    db.addIndex('endpoints', 'unique_endpoint', 'endpoint', true, callback);
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
