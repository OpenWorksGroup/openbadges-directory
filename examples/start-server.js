process.env.BADGE_STORE = __dirname + '/badges-example.json';
process.env.API_KEY = 'EXAMPLE_API_KEY';
require('../lib/server')();