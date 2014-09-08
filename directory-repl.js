var repl     = require('repl'),
    Elastic  = require('./lib/engine'),
    instance = new Elastic();

var replServer = repl.start({
  prompt: 'directory > '
});

replServer.context.ElasticSearch = Elastic;
replServer.context.elasticSearch = instance;
replServer.context.deleteByEndpoint = instance.deleteByEndpoint.bind(instance);
replServer.context.deleteIndex = instance.deleteIndex.bind(instance);