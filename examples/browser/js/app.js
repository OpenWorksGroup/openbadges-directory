'use strict';

var app = angular.module('directory', ['ngRoute', 'directoryControllers']);
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/badges', {
        templateUrl: 'js/partials/badge-list.html',
        controller: 'DirectoryController'
      }).
      otherwise({
        redirectTo: '/badges'
      })
  }
]);
