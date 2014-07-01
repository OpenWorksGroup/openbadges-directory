var validator = require('openbadges-validator');

module.exports = function (doc) {
  return validator.badgeClass(doc);
};

//testRequired(badge.name, isString, {field: p('name')});
//testRequired(badge.description, isString, {field: p('description')});
//testRequired(badge.image, isAbsoluteUrlOrDataURI, {field: p('image')});
//testRequired(badge.criteria, isAbsoluteUrl, {field: p('criteria')});
//testRequired(badge.issuer, isAbsoluteUrl, {field: p('issuer')});
//testOptional(badge.tags, isArray(isString), {
//  field: p('tags'),
//  message: 'must be an array of strings'
//});
//testOptional(badge.alignment, isArray(isValidAlignmentStructure), {
//  field: p('alignment'),
//  message: 'must be an array of valid alignment structures (with required `name` and `url` properties and an optional `description` property)'
//});