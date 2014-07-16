'use strict';

var app = angular.module('directory', ['appPageControllers']);
app.config(function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
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