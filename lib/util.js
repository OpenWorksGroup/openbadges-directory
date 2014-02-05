module.exports = {
  parseSearch: function (req) {
    var parsed = {},
        query  = req.query;
    if (query.tags) {
      parsed.tags = query.tags.split(',');
    }
    query.q && (parsed.q = query.q);
    query.name && (parsed.name = query.name);
    query.criteria && (parsed.criteria = query.criteria);
    query.issuer && (parsed.issuer = query.issuer);
    return parsed;
  }
};