var restify  = require('restify'),
    validate = require('node-restify-validation'),
    search   = require('./search'),
    api      = require('./api'),
    logger   = require('./logger'),
    swagger  = require('./swagger');

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

  server.get('/', function(req, res) {
    res.header('Location', 'http://mozilla.github.io/openbadges-directory/');
    res.send(302);
  });
   
  server.get('/search', api.search);
  server.get('/recent', api.recent);
  server.get('/tags', api.tags);
  server.get('/issuers', api.issuers);
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

  server.listen(process.env.PORT || 9000, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
};