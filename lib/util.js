var unsignedInt = function (value, defaultValue, limit) {
  var parsed = parseInt(value, 10);
  if (!parsed || parsed < 0) { parsed = defaultValue; }
  if (parsed > limit) { parsed = limit; }
  return parsed;
};
var parseMeta = function (req) {
  var parsed = {},
      query  = req.query;
  query.limit && (parsed.limit = unsignedInt(query.limit, 10, 100));
  query.page && (parsed.page = unsignedInt(query.page, 10, 100));
  return parsed;
};

module.exports = {
  parseSearch: function (req) {
    var parsed = parseMeta(req),
        query  = req.query;
    query.tags && (parsed.tags = query.tags.split(','));
    query.q && (parsed.q = query.q);
    return parsed;
  },
  parseRecent: function (req) {
    return parseMeta(req);
  }
};