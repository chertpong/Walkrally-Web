'use strict';
angular.module('myApp.admin', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/admin/places', {
      templateUrl: 'admin/places/list.html',
      controller: 'AdminPlaceListCtrl'
    })
  }])
  .controller('AdminPlaceListCtrl', [
    '$scope', 'Config', 'localStorageService', '$log','$http', '$location',
    function($scope, Config, localStorageService, $log, $http, $location) {
      $scope.places = [];
      $scope.search = '';
      var path = Config.backendUrl+'/api/places';
      $http
        .get(path,{
          headers:{
            'X-ACCESS-TOKEN': localStorageService.get('token')
          }
        })
        .then(function(response) {
          $scope.places = response.data;
          $log.debug('[+] load places: ', $scope.places.length);
        })
        .catch(function(err) {
          $scope.isEnabledLoginButton = true;
          $log.debug(err);
        });

    }]);