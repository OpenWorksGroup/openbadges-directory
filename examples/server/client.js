var rest     = require('restler');

//TODO once there are error codes returned, we'll want to use the statusCode
//  on('complete', function (result, response) {
//    console.log(response && response.statusCode);
var Client = module.exports = function (options) {
  this.endpoint = options.endpoint;
  this.limit = options.limit || 10;
};

/**
 * Accepts an object of search criteria, and returns either an error, or an array of badge classes.
 * Allowable search criteria are:
 * {
   *   search: string,
   *   tags: array
   * }
 * @param criteria object criteria you are search on (search / tags)
 * @param callback function with a signature of (Error, Array)
 * @returns {*}
 */
Client.prototype.search = function (criteria, callback) {
  criteria = criteria || {};
  var tags   = criteria.tags && criteria.tags.join(','),
      q      = criteria.search,
      search = [];
  if (tags) {
    search.push('tags=' + tags);
  }
  if (q) {
    search.push('q=' + q);
  }
  if (!search.length) {
    return callback(new Error('You must supply search criteria in the form of a "tags" array, or "search" string'));
  }
  rest.get(this.endpoint + '/search?' + search.join('&')).on('complete', function (result, response) {
    if (result instanceof Error) {
      return callback(result);
    }
    return callback(null, result.data);
  });
};

/**
 * Accepts a url location of the badge class.
 * @param location string url of the badge class
 * @param callback function with a signature of (Error, Object)
 */
Client.prototype.getByLocation = function (location, callback) {
  var encodedLocation = encodeURIComponent(location);
  rest.get(this.endpoint + '/' + encodedLocation).on('complete', function (result) {
    if (result instanceof Error) {
      return callback(result);
    }
    return callback(null, result.data);
  });
};

/**
 * Gets the most recently indexed badges.
 * @param options object allows for pagination information
 * @param callback function with a signature of (Error, Object)
 */
Client.prototype.recent = function (options, callback) {
  rest.get(this.endpoint + '/recent').on('complete', function (result) {
    if (result instanceof Error) {
      return callback(result);
    }
    return callback(null, result.data);
  });
};