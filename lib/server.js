var restify = require('restify'),
    search  = require('./search');


module.exports = function () {
  var server = restify.createServer({
    name: 'directory',
    version: '0.1.0'
  });
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  server.get('/search', function (req, res, next) {
    search.search({}, function (err, results) {
      res.send({
        toJSON: function () {
          return {
            total: results.length,
            limit: 10,
            data: results
          };
        }
      });
    });
    return next();
  });

  search.load(__dirname + '/../db/badges.json', function (/*err*/) {
    console.log('Loaded badges');
    server.listen(process.env.PORT || 9000, function () {
      console.log('%s listening at %s', server.name, server.url);
    });
  });
};