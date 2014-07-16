'use strict';

var appPageControllers = angular.module('appPageControllers', []);



appPageControllers.controller('RegisterController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
  $scope.registerData = {
    name: '',
    endpoint: '',
    email: '',
    website: '',
    description: '',
    organization: ''
  };
  $scope.success = false;

  $scope.register = function () {
    $http({
      url: 'http://test-openbadges-directory.herokuapp.com/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: $scope.registerData
    }).success(function (response) {
      if (response.data && response.data.success) {
        $scope.success = true;
        $scope.errors = null;
      }
    }).error(function (data, status) {
      $scope.errors = data.errors;
      alert('There was an error during your registration. Please try again.');
    });
  };

  $scope.$watch('name', function () {
    console.log($scope.name);
  });
//    $http.get(endpoint + '/search?page=' + page + (query.length ? '&' + query.join('&') : '')).success(function (response) {
//      if (!response.data.length) { done = true; }
//      if ($scope.badges && $scope.badges.length) {
//        response.data.forEach(function (item) { $scope.badges.push(item); });
//      } else {
//        $scope.badges = response.data;
//      }
//    });
//  };
}]);