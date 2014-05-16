'use strict';

var directoryControllers = angular.module('directoryControllers', []),
    validUrl = function (url) {
//      return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
      return true;
    };

directoryControllers.controller('DirectoryController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
//   $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
   $http.defaults.headers.common = {'Authorization': 'Basic MTIzNDU2Nw=='};

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
  $scope.addTagFromForm = function () {
    $scope.tagEnter = $scope.tagEnter == null ? true : !$scope.tagEnter;
  };
}]);

directoryControllers.controller('RecentController', ['$scope', '$http', function ($scope, $http) {
  $scope.$parent.searchOff('Search not supported for Recent items');

  var page = 0,
      done = false;
  $scope.nextPage = function () {
    if (done) { return; }
    page++;
    if (page > 10) {
      done = true;
    }
    $http.get('/recent?page=' + page).success(function (response) {
      if (!response.data.length) { done = true; }
      if ($scope.badges && $scope.badges.length) {
        response.data.forEach(function (item) { $scope.badges.push(item); });
      } else {
        $scope.badges = response.data;
      }
    });
  };
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
  $scope.tag = '';
  $scope.tags = [];
  $scope.removeTag = function (index) {
    $scope.tags.splice(index, 1);
  };
  $scope.addTag = function (badge, index) {
    var tags = badge.tags;
    if ($scope.tags.indexOf(tags[index]) === -1) {
      $scope.tags.push(tags[index]);
    }
  };


  var page = 0,
      done = false;
  $scope.nextPage = function () {
    if (!$scope.search && !$scope.tags.length) { return; }
    if (done) { return; }
    page++;

    var query = [];
    if ($scope.search) { query.push('q=' + encodeURIComponent($scope.search)); }
    if ($scope.tags.length) { query.push('tags=' + $scope.tags.join(',')); }

    $http.get('/search?page=' + page + (query.length ? '&' + query.join('&') : '')).success(function (response) {
      if (!response.data.length) { done = true; }
      if ($scope.badges && $scope.badges.length) {
        response.data.forEach(function (item) { $scope.badges.push(item); });
      } else {
        $scope.badges = response.data;
      }
    });
  };

  $scope.$watch('search', function () {
    if (!$scope.search) { return; }
    page = 0;
    done = false;
    $scope.badges = [];
    $scope.nextPage();
  });
  $scope.$watch('tags', function () {
    page = 0;
    done = false;
    $scope.badges = [];
    $scope.nextPage();
  }, true);
  $scope.$parent.$watch('tagEnter', function () {
    if (!$scope.$parent.tag) {
      return;
    }
    if ($scope.tags.indexOf($scope.$parent.tag) === -1) {
      $scope.tags.push($scope.$parent.tag);
    }
    $scope.$parent.tag = '';
  });
}]);