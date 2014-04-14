var restify = require('restify'),
    search  = require('./search'),
    util    = require('./util'),
    logger  = require('./logger');

module.exports = function () {
  var server = restify.createServer({
    name: 'directory',
    version: '0.1.0',
    log: logger
  });

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(function (req, res, next) {
    res.on('finish', function () {
      req.log.info({ url: req.url, status: res.statusCode });
    });
    next();
  });
  server.use(restify.authorizationParser());

  server.use(function (req, resp, next) {
    if (!req.authorization) {
      return next(new restify.InvalidCredentialsError('Basic Authorization is required, with the API Key as the username'));
    }
    if (!(req.authorization.basic && req.authorization.basic.username)) {
      return next(new restify.InvalidCredentialsError('API Key required'));
    }
    var apiKey = req.authorization.basic.username;
    if (apiKey !== process.env.API_KEY) {
      return next(new restify.InvalidCredentialsError('API Key not recognized'));
    }
    next();
  });

  server.get('/search', function (req, res, next) {
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
  });

  server.get('/recent', function (req, res, next) {
    var recentParams = util.parseRecent(req);
    search.search(recentParams, function (err, results) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      res.send({ data: results });
    });
  });

  server.get('/:location', function (req, res, next) {
    search.get(req.params.location, function (err, result) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      if (!result) {
        return next(new restify.NotFoundError());
      }
      res.send({ data: result });
    });
  });

  search.load(process.env.BADGE_STORE || (__dirname + '/../db/badges.json'), function (/*err*/) {
    console.log('Loaded badges');
    server.listen(process.env.PORT || 9000, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
};