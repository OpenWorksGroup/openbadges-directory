var swagger = require('swagger-doc');

module.exports = function (restifyServer) {
  swagger.configure(restifyServer, {
    discoveryUrl: '/developers/api-explorer/resources.json',
    version:      '0.1',
    basePath:     ''
  });

  var search = swagger.createResource('/developers/explorer/search', {
    models: {
      RegisterRequest: {
        id: 'RegisterRequest',
        required: ['email', 'name', 'website', 'endpoint'],
        properties: {
          endpoint: { type: 'URL' },
          name: { type: 'string' },
          email: { type: 'string' },
          website: { type: 'URL' },
          organization: { type: 'string' },
          description: { type: 'string' }
        }
      }
    }
  });

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
    },  {
      paramType: 'query',
      name: 'name',
      description: 'Name of a badge class',
      required: false,
      dataType: 'string'
    },  {
      paramType: 'query',
      name: 'issuer',
      description: 'Name of an issuer. This is only available for badge classes whose issuer URL returns an IssuerOrganization JSON object',
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
  
  var location = encodeURIComponent(location);

  search.get('/{location}', 'Get a specific badge class by (encoded) url', {
    notes: 'Gets a badge class with the url (encoded) of where the badge class is hosted',
    nickname: 'byUrl',
    parameters: [{
      name: 'location',
      description: 'Encoded Url of the badge class',
      required: true,
      dataType: 'string',
      paramType: 'path'
    }]
  });

  search.get('/tags', 'Gets all recent tags and number of times each tag is being used', {
    notes: 'Gets all recent tags and number of times each tag is being used',
    nickname: 'getTags',
    parameters: [{
      paramType: 'query',
      name: 'limit',
      description: 'How many results to returning',
      required: false,
      dataType: 'integer'
    }]
  });
  
  search.get('/issuers', 'Gets all issuers that have been indexed and the url if provided.', {
    notes: 'Gets all issuers that have been indexed and the url if provided.',
    nickname: 'getIssuers',
    parameters: [{
      paramType: 'query',
      name: 'limit',
      description: 'How many results to returning',
      required: false,
      dataType: 'integer'
    }]
  });

/*  search.post('/register', 'Register an endpoint for indexing', {
    notes: 'Registers an endpoint to be indexed by the directory',
    nickname: 'registerEndpoint',
    parameters: [{
      paramType: 'body',
      name: 'endpoint',
      description: 'Endpoint contents',
      required: true,
      dataType: 'RegisterRequest'
    }]
  });*/
};