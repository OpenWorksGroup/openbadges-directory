var cluster = require('cluster'),
    os      = require('os'),
    server  = require('./lib/server');

if (cluster.isWorker) {
  return server();
}

for (var i = 0; i < os.cpus().length; i++) {
  cluster.fork();
}

cluster.on('exit', function (/*worker, code, signal*/) {
  cluster.fork();
});

process.on('uncaughtException', function (err) {
  process.exit(err);
});