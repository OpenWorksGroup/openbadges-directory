'use strict';

var app = angular.module('directory', ['ngRoute', 'infinite-scroll', 'ui.bootstrap', 'directoryControllers']);
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/recent', {
        templateUrl: 'browser/js/partials/badge-list.html',
        controller: 'RecentController'
      }).
      when('/search', {
        templateUrl: 'browser/js/partials/badge-list.html',
        controller: 'SearchController'
      }).
      when('/get', {
        templateUrl: 'browser/js/partials/badge-list.html',
        controller: 'GetController'
      }).
      when('/badge-class/:id', {
        templateUrl: 'browser/js/partials/badge-class.html',
        controller: 'GetController'
      }).
      otherwise({
        redirectTo: '/recent'
      })
  }
]);
app.directive('cancelClick', function () {
  return function(scope, element, attrs) {
    element.bind('click', function (e) {
      e.preventDefault && e.preventDefault();
      e.stopPropagation();
    });
  };
});
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});