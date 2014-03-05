'use strict';

var Model      = require('human-model'),
    Backbone   = require('backbone'),
    $          = require('jquery'),
    Collection = Backbone.Collection;
Backbone.$ = $;

module.exports = {
  BadgeClass: Model.define({
    type: 'badge_class',
    props: {
      location: ['string'],
      name: ['string'],
      description: ['string'],
      image: ['string'],
      criteria: ['string'],
      issuer: ['string'],
      tags: ['array'],
      _indexed_at: ['string']
    },
    parse: function (result) {
      return result.data;
    },
    initialize: function (options) {
      this.instanceUrl = options.url;
    },
    url: function () {
      return this.instanceUrl;
    }
  }),
  BadgeClasses: Collection.extend({
    model: module.exports.BadgeClass,
    initialize: function (options) {
      this.instanceUrl = options.url;
    },
    url: function () {
      return this.instanceUrl;
    }
  })
};