'use strict';
angular.module('myApp.admin', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/admin/places', {
        templateUrl: 'admin/places/list.html',
        controller: 'AdminPlaceListCtrl'
      })
      .when('/admin/places/:id', {
        templateUrl: 'admin/places/edit',
        controller:'AdminPlaceEditDetailCtrl'
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
      $scope.goEdit = function(id){
        $log.debug('[~] ','go to edit page of place id:',id);
        $location.path('admin/places/'+id);
      }
    }])
  .controller('AdminPlaceEditDetailCtrl', [
    '$scope', 'Config', 'localStorageService', '$log','$http', '$location','$routeParams','$q','$timeout',
    function($scope, Config, localStorageService, $log, $http, $location, $routeParams, $q,$timeout) {
      $scope.place = {};
      
      $scope.workingDay = [
        'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Mon-Sat','Mon-Fri','Everyday',
        'Everyday except Monday','Everyday except Tuesday','Everyday except Wednesday',
        'Everyday except Thursday','Everyday except Friday'
      ];
      $scope.workingDaySearchText = '';
      $scope.workingDaySearch = function(searchText){
        var deferred = $q.defer();
        var result = $scope.workingDaySearchText ? $scope.workingDay.filter(function(wd){
          return wd.toLowerCase().indexOf(searchText.toLowerCase()) === 0;
        }) : $scope.workingDay;
        $timeout(function () { deferred.resolve( result ); }, 100, false);
        return deferred.promise;
      };
      var path = Config.backendUrl+'/api/places/'+$routeParams.id;

      $http
        .get(path,{
          headers:{
            'X-ACCESS-TOKEN': localStorageService.get('token')
          }
        })
        .then(function(response) {
          $scope.place = response.data;
          $log.debug('[+] load place: ', $scope.place.name);
        })
        .catch(function(err) {
          $log.debug('[!]',err);
        });
    }]);