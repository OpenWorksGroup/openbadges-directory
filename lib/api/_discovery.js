var mysql      = require('mysql'),
    async      = require('async'),
    config     = require('../config'),
    logger     = require('../logger'),
    connection = mysql.createConnection(config('DATABASE_URL'));

module.exports = {
  listing: function (req, res, next) {
    connection.query('SELECT id FROM listings', function (err, rows) {
      if (err) { return next(err); }

      return res.send({
        badgelist: rows.map(function (row) {
          return {
            location: config('URL') + req.url + '/' + row.id
          };
        })
      });
    });
  },
  listingGet: function (req, res, next) {
    connection.query('SELECT id, badge_class FROM listings WHERE ?', { id: req.params.id }, function (err, rows) {
      if (err) { return next(err); }

      if (rows.length) {
        return res.send(JSON.parse(rows[0].badge_class));
      }
      return res.send({}, 404);
    });
  },
  populate: function (req, res, next) {
    var googleLoad = require('./_google-store');
    connection.beginTransaction(function (err) {
      if (err) { return next(err); }

      async.parallel([
        function truncateListings(callback) {
          connection.query('DELETE FROM listings', callback);
        },
        function loadSpreadsheet(callback) {
          googleLoad(function (results) { return callback(null, results); });
        }
      ], function complete(err, results) {
        if (err) { return next(err); }
        var badges = results[1]
          && results[1].achievements
          && results[1].achievements.filter(function (result) { return result.type === 'badge'; });

        logger.info('Deleted all rows from `listings`. Number deleted = [' + results[0].affectedRows + ']');
        logger.info('Retrieved rows from the badges spreadsheet. Number retrieved = [' + badges.length + ']');

        async.each(badges, function insert(badge, callback) {
          connection.query('INSERT INTO listings SET ?', { badge_class: JSON.stringify(badge) }, callback);
        }, function complete(err) {
          if (err) {
            return connection.rollback(function () {
              res.send({success: false, error: err});
            });
          }

          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                res.send({success: false, error: err});
              });
            }

            res.send({success: true});
          });

        });
      });
    });
  }
};