var restify = require('restify'),
    search  = require('./search'),
    api     = require('./api/search'),
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

  server.get('/temp/discovery/listing', require('./api/_discovery').listing);
  server.get('/temp/discovery/listing/:id', require('./api/_discovery').listingGet);
  server.get('/temp/discovery/populate', require('./api/_discovery').populate);
  server.get('/search', api.search);
  server.get('/recent', api.recent);
  server.get('/:location', api.get);

  search.load(process.env.BADGE_STORE || (__dirname + '/../db/badges.json'), function (/*err*/) {
    console.log('Loaded badges');
    server.listen(process.env.PORT || 9000, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
};