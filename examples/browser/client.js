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
  derived: {
    tagNames: function () {
      return (this.tags || []).join(', ');
    }
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
    location: '.js-location',
    name: '.js-name',
    tagNames: '.js-tags'
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
      'keyup': 'search',
      'change': 'search'
    },
    initialize: function () {
      this.badges = new BadgeClasses({ url: 'http://localhost:3000/search' });
      this.badges.fetch({data: {
        page: this.$('select[id=page] option:selected').val(),
        limit: this.$('select[id=limit] option:selected').val()
      }});
    },
    render: function () {
      this.renderAndBind();
      this.renderSubview(new ResultView({collection: this.badges}), '.result');
      return this;
    },
    search: function () {
      var byLocation = this.$('input[id=location]');
      var tags   = this.$('input[id=tags]').val(),
          q      = this.$('input[id=q]').val(),
          page   = this.$('select[id=page] option:selected').val(),
          limit  = this.$('select[id=limit] option:selected').val(),
          data   = {data: {}};
      q && (data.data['q'] = q);
      tags && (data.data['tags'] = tags);
      limit && (data.data['limit'] = limit);
      page && (data.data['page'] = page);
      if (byLocation.val()) {
        this.badges.instanceUrl = 'http://localhost:3000/' + encodeURIComponent(byLocation.val());
        this.badges.fetch();
      } else {
        this.badges.instanceUrl = 'http://localhost:3000/search';
        this.badges.fetch(data);
      }
    }
  })
};