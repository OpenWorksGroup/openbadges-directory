'use strict';

var app = angular.module('directory', ['ngRoute', 'directoryControllers']);
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/recent', {
        templateUrl: 'js/partials/badge-list.html',
        controller: 'RecentController'
      }).
      when('/search', {
        templateUrl: 'js/partials/badge-list.html',
        controller: 'SearchController'
      }).
      when('/get', {
        templateUrl: 'js/partials/badge-list.html',
        controller: 'GetController'
      }).
      when('/badge-class/:id', {
        templateUrl: 'js/partials/badge-class.html',
        controller: 'GetController'
      }).
      otherwise({
        redirectTo: '/recent'
      })
  }
]);
