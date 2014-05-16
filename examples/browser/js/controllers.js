'use strict';

var directoryControllers = angular.module('directoryControllers', []);

directoryControllers.controller('DirectoryController', ['$scope', '$location', function ($scope, $location) {
  $scope.search = '';
  $scope.searchOn = function () {
    $scope.search = '';
    $scope.disabled = false;
  };
  $scope.searchOff = function () {
    $scope.search = '';
    $scope.disabled = true;
  };
  $scope.isActive = function (path) {
    return $location.path().substr(0, path.length) == path;
  };
}]);
directoryControllers.controller('RecentController', ['$scope', function ($scope) {
  $scope.$parent.searchOff();
}]);
directoryControllers.controller('SearchController', ['$scope', function ($scope) {
  $scope.$parent.searchOn();
}]);
directoryControllers.controller('GetController', ['$scope', function ($scope) {
  $scope.$parent.searchOff();
}]);
directoryControllers.controller('BadgeClassDetailController', ['$scope', function ($scope) {
  $scope.$parent.searchOn();
}]);