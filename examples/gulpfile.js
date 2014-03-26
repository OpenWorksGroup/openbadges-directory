var gulp       = require('gulp');

gulp.task('startServer', function () {
  var express   = require('express'),
      app       = express(),
      httpProxy = require('http-proxy'),
      host      = 'localhost',
      port      = 3000,
      proxyPort = 9000,
      proxy     = httpProxy.createProxyServer();

  app.use(express.static(__dirname + '/browser'));
  app.use(function (req, res) {
    //add api key on the proxy, so we don't need to put it in the client code
    var apiKey = new Buffer('EXAMPLE_API_KEY:', 'ascii');
    apiKey = apiKey.toString('base64');
    req.headers.authorization = 'Basic ' + apiKey;
    proxy.web(req, res, { target: 'http://' + host + ':' + proxyPort });
  });
  app.listen(port);
});

gulp.task('default', ['startServer']);