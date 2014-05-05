var restify = require('restify'),
    logger  = require('../logger'),
    util    = require('../util'),
    search  = require('../search');

module.exports = {
  search: function (req, res, next) {
    if (!Object.keys(req.query).length) {
      return next(new restify.BadRequestError('You must specify arguments to execute a search'));
    }

    var searchParams = util.parseSearch(req);
    search.search(searchParams, function (err, results) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      res.send({ data: results });
    });
  },

  recent: function (req, res, next) {
    var recentParams = util.parseRecent(req);
    search.search(recentParams, function (err, results) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      res.send({ data: results });
    });
  },

  get: function (req, res, next) {
    search.get(req.params.location, function (err, result) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      if (!result) {
        return next(new restify.NotFoundError());
      }
      res.send({ data: result });
    });
  },

  listing: function (req, res, next) {

  }
};