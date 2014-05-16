'use strict';

var directoryControllers = angular.module('directoryControllers', []),
    validUrl = function (url) {
//      return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
      return true;
    };

directoryControllers.controller('DirectoryController', ['$scope', '$location', function ($scope, $location) {
  $scope.searchOn = function (placeholder) {
    $scope.search = '';
    $scope.placeholder = placeholder;
    $scope.disabled = false;
  };
  $scope.searchOff = function (placeholder) {
    $scope.search = '';
    $scope.placeholder = placeholder;
    $scope.disabled = true;
  };
  $scope.isActive = function (path) {
    return $location.path().substr(0, path.length) == path;
  };
  $scope.pager = function () {};
}]);

directoryControllers.controller('RecentController', ['$scope', '$http', function ($scope, $http) {
  $scope.$parent.searchOff('Search not supported for Recent items');
  $http.get('/recent').success(function (response) {
    $scope.badges = response.data;
  });
}]);

directoryControllers.controller('GetController', ['$scope', '$http', function ($scope, $http) {
  $scope.$parent.searchOn('Please enter a badge class url');
  $scope.$watch('search', function () {
    if (!validUrl($scope.search)) { return; }
    $http.get('/' + encodeURIComponent($scope.search)).success(function (response) {
      $scope.badges = [response.data];
    });
  });
}]);

directoryControllers.controller('SearchController', ['$scope', '$http', function ($scope, $http) {
  $scope.$parent.searchOn('What are searching for?');
  $scope.$watch('search', function () {
    if (!$scope.search) { return; }
    $http.get('/search?q=' + encodeURIComponent($scope.search)).success(function (response) {
      $scope.badges = response.data;
    });
  });
}]);
//directoryControllers.controller('BadgeClassDetailController', ['$scope', function ($scope) {
//  $scope.$parent.searchOn();
//}]);