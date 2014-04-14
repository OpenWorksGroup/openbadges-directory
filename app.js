var cluster = require('cluster'),
    os      = require('os'),
    server  = require('./lib/server'),
    logger  = require('./lib/logger');

if (cluster.isWorker) {
  return server();
}

for (var i = 0; i < os.cpus().length; i++) {
  cluster.fork();
}

cluster.on('exit', function (worker, code, signal) {
  logger.error('Worker %s died with code %s', worker.process.pid, code);
  cluster.fork();
});

process.on('uncaughtException', function (err) {
  logger.fatal(err);
  process.exit(err);
});