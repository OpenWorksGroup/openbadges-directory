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
    proxy.web(req, res, { target: 'http://' + host + ':' + proxyPort });
  });
  app.listen(port);
});

gulp.task('default', ['startServer']);