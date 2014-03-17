var Client = require('./client');

setTimeout(function () {
  var client = new Client({
    endpoint: 'http://localhost:9000'
  });
  client.getByLocation('http://www.no-reply.com/12', function (err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
  client.search({search: 'yea', tags: ['hours-1']}, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
  client.recent({}, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
}, 5000);
