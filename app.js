var cluster = require('cluster'),
    os      = require('os'),
    server  = require('./lib/server'),
    logger  = require('./lib/logger'),
    workers = {};

var fork = function (cluster, isJob) {
  var worker;
  if (isJob) {
    logger.info('Starting Job process.');
    worker = cluster.fork({
      IS_JOB: true
    });
  } else {
    logger.info('Starting API process.');
    worker = cluster.fork();
  }
  workers[worker.id] = {isJob: isJob};
};

if (cluster.isWorker) {
  if ('IS_JOB' in process.env) {
    return require('./lib/indexer');
  } else {
    return server();
  }
}

for (var i = 0; i < os.cpus().length; i++) {
  fork(cluster, os.cpus().length > 1 && i === 0);
}

cluster.on('exit', function (worker, code, signal) {
  logger.error('Worker %s died with code %s', worker.process.pid, code);

  var isJob = workers[worker.id].isJob;
  delete workers[worker.id];
  console.log('test it', isJob);
  fork(cluster, isJob);
});

process.on('uncaughtException', function (err) {
  logger.fatal(err);
  process.exit(err);
});