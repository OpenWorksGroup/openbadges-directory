var restify  = require('restify'),
    validate = require('node-restify-validation'),
    search   = require('./search'),
    api      = require('./api'),
    logger   = require('./logger'),
    swagger  = require('./swagger');

/*var authMiddleware = function (req, resp, next) {
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
};*/

module.exports = function () {
  var server = restify.createServer({
    name: 'directory',
    version: '0.1.0',
    log: logger
  });

  swagger(server); //enable the swagger endpoint
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(function (req, res, next) { //logging
    res.on('finish', function () {
      req.log.info({ url: req.url, status: res.statusCode });
    });
    next();
  });
  server.use(restify.authorizationParser());
  server.use(restify.fullResponse());
  restify.CORS.ALLOW_HEADERS.push('authorization'); //the restify CORS headers don't come with authorization
  server.use(restify.CORS());
  server.use(validate.validationPlugin({ errorsAsArray: false })); //inline route validation support

  server.get('/temp/discovery/listing', require('./api/_discovery').listing);
  server.get('/temp/discovery/listing/:id', require('./api/_discovery').listingGet);
  server.get('/temp/discovery/populate', require('./api/_discovery').populate);
  server.get('/search', api.search);
  server.get('/recent', api.recent);
  server.get('/tags', api.tags);
  server.post({
    url: '/register',
    validation: {
      endpoint: { isRequired: true, isUrl: true, scope: 'body' },
      name: { isRequired: true, scope: 'body' },
      email: { isRequired: true, isEmail: true, scope: 'body' },
      website: { isRequired: true, isUrl: true, scope: 'body' }
    }
  }, api.register);
  server.get(/\/developers\/api-explorer\/?.*/, restify.serveStatic({
    directory: __dirname + '/..',
    default: 'index.html'
  }));
  server.get(/\/examples\/browser\/?.*/, restify.serveStatic({
    directory: __dirname + '/..',
    default: 'example.html'
  }));
  server.get('/:location', api.get);

  search.load(process.env.BADGE_STORE || (__dirname + '/../db/badges.json'), function (/*err*/) {
    server.listen(process.env.PORT || 9000, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
};