var Client = require('openbadges-directory-client').Client;

setTimeout(function () {
  var client = new Client({
    endpoint: 'http://localhost:9000',
    apiKey: 'EXAMPLE_API_KEY'
  });
  client.getByLocation('http://achievery.com/badge-class/286', function (err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
  client.search({search: 'Blog - Entrada', tags: ['Education Post Secondary']}, function (err, data) {
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
