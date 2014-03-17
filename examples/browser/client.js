'use strict';

var Model      = require('human-model'),
    View       = require('human-view'),
    Backbone   = require('backbone'),
    Collection = Backbone.Collection;
Backbone.$ = window.$;

var BadgeClass = Model.define({
  type: 'badge_class',
  props: {
    location: ['string'],
    name: ['string'],
    description: ['string'],
    image: ['string'],
    criteria: ['string'],
    issuer: ['string'],
    tags: ['array'],
    _indexed_at: ['number']
  },
  initialize: function (options) {
    this.instanceUrl = options.url;
  },
  url: function () {
    return this.instanceUrl;
  }
});

var BadgeClasses = Collection.extend({
  model: BadgeClass,
  parse: function (result) {
    return result.data;
  },
  initialize: function (options) {
    this.instanceUrl = options.url;
  },
  url: function () {
    return this.instanceUrl;
  }
});
var ItemView = View.extend({
  template: $('#class-row').html(),
  textBindings: {
    location: '.js-location'
  },
  srcBindings: {
    image: '.js-badge-image'
  },
  render: function () {
    this.renderAndBind(this.model.toJSON());
    return this;
  }
});
var ResultView = View.extend({
  render: function () {
    this.$el.empty();
    this.$el.append('<ul></ul>');
    this.renderCollection(this.collection, ItemView, this.$('ul')[0]);
  }
});

module.exports = {
  BadgeClass: BadgeClass,
  BadgeClasses: BadgeClasses,
  SearchView: View.extend({
    template: $('#search').html(),
    events: {
      'keyup': 'search'
    },
    render: function () {
      this.badges = new BadgeClasses({ url: 'http://localhost:3000/search' });
      this.renderAndBind();
      this.renderSubview(new ResultView({collection: this.badges}), '.result');
      return this;
    },
    search: function () {
      var values = this.$('input[id=tags],input[id=q]'),
          data   = {data: {}};
      values.each(function (i, el) {
        data.data[el.id] = $(el).val();
      });
      this.badges.fetch(data);
    }
  })
};