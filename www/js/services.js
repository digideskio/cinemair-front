var serverURL = 'http://127.0.0.1:8000/api/v1';
angular.module('cinemair.services', [])
.factory('CinemairSrv', function($http) {
    getMovies = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/movies'
        }).success(function(data) {
            movies = data;
        });
    };
    getCinemas = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/cinemas'
        }).success(function(data) {
            cinemas = data;
        });
    };
    getShows = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/shows'
        }).success(function(data) {
            shows = data;
        });
    };
    getEvents = function() {
        return $http({
            method: 'GET',
            url: serverURL + '/events'
        }).success(function(data) {
            events = data;
        });
    };
    return {
        getMovies: getMovies,
        getCinemas: getCinemas,
        getShows: getShows,
        getEvents: getEvents
    };
})
