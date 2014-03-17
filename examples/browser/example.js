'use strict';

var client       = require('./client');
document.body.appendChild(new client.SearchView().render().el);

//console.log(badge.toJSON(), badges.toJSON());