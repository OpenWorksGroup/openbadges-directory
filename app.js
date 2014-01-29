var cluster = require('cluster'),
    os      = require('os');

if (cluster.isWorker) {
  var search = require('./lib/search');
  return search.load(__dirname + '/db/badges.json', function (/*err*/) {
    console.log(search.search({}, function () {}));
  });
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