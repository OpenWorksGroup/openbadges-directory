var cluster = require('cluster'),
    os      = require('os'),
    server  = require('./lib/server'),
    logger  = require('./lib/logger');

if (cluster.isWorker) {
  if ('IS_JOB' in process.env) {
    logger.info('Starting job');
    return require('./lib/indexer/indexer');
  } else {
    return server();
  }
}

for (var i = 0; i < os.cpus().length; i++) {
  if (os.cpus().length > 1 && i === 0) {
    cluster.fork({
      IS_JOB: true
    });
  } else {
    cluster.fork();
  }
}

cluster.on('exit', function (worker, code, signal) {
  logger.error('Worker %s died with code %s', worker.process.pid, code);
  cluster.fork();
});

process.on('uncaughtException', function (err) {
  logger.fatal(err);
  process.exit(err);
});