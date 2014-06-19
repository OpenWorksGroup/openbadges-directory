var swagger = require('swagger-doc');

module.exports = function (restifyServer) {
  swagger.configure(restifyServer, {
    discoveryUrl: '/developers/api-explorer/resources.json',
    version:      '0.1',
    basePath:     ''
  });

  var search = swagger.createResource('/developers/explorer/search');
  search.get('/search', 'Search for badge classes', {
    notes: 'Searches for badges by a generic full-text search criteria, or more specifically by tags in a paginated response.',
    nickname: 'search',
    parameters: [{
      paramType: 'query',
      name: 'q',
      description: 'Text to be used as a full-text search of all available badges',
      required: false,
      dataType: 'string'
    }, {
      paramType: 'query',
      name: 'tags',
      description: 'Comma separated list of tags to use in the search. Multiple tags result in an AND condition',
      required: false,
      dataType: 'string'
    }, {
      paramType: 'query',
      name: 'page',
      description: 'Page of results you are requested',
      required: false,
      dataType: 'integer'
    }, {
      paramType: 'query',
      name: 'limit',
      description: 'How many results to returning',
      required: false,
      dataType: 'integer'
    }]
  });

  search.get('/recent', 'Recently indexed badge classes endpoint', {
    notes: 'Gets all recent badge classes indexed in a paginated response.',
    nickname: 'recent',
    parameters: [{
      paramType: 'query',
      name: 'page',
      description: 'Page of results you are requested',
      required: false,
      dataType: 'integer'
    }, {
      paramType: 'query',
      name: 'limit',
      description: 'How many results to returning',
      required: false,
      dataType: 'integer'
    }]
  });

  search.get('/{location}', 'Get a specific badge class', {
    notes: 'Gets a badge class the the url of where the badge class is hosted',
    nickname: 'byUrl',
    parameters: [{
      name: 'id',
      description: 'Url of the badge class',
      required: true,
      dataType: 'string',
      paramType: 'path'
    }]
  });
//  , {
//    paramType: 'header',
//      name: 'Basic',
//      description: 'Basic auth containing the api key',
//      required: true,
//      dataType: 'string'
//  }
//  api.models.Model = {};
};