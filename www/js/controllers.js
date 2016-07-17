angular.module('cinemair.controllers', [])

/******************************************************/
/* Login Controller
/******************************************************/
.controller('LoginCtrl', function($scope, $ionicLoading, $ionicBackdrop, UserSrv, $stateParams, $location) {
    $scope.login = function() {
        UserSrv.googleAuth.getAuthorizedCodeFromGoogle();
    };

    _goToSchedule = function(){
        $location.url("/tab/schedule");
    };

    user = UserSrv.getUser()

    if(!_.isUndefined(user) && !_.isNull(user)){
        _goToSchedule();
    }

    if ($stateParams.state === "google-login"){
        $ionicBackdrop.retain();
        $ionicLoading.show({content: 'Loading shows'});

        code = $stateParams.code
        UserSrv.googleAuth.loginOrRegisterWithGoogleAccount(code).then(function(){
            _goToSchedule()
            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    }
})


/******************************************************/
/* User Dates Controller
/******************************************************/
.controller('DatesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        UserSrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading shows'});

    CinemairSrv.getShows().success(function(shows) {
        $ionicLoading.hide();
        $ionicBackdrop.release();

        $scope.shows = _.groupBy(shows, function(show) {
            return moment(show.datetime).format('Do MMM YYYY');
        });
    });

    $scope.toggleShow = function(show) {
        $ionicLoading.show({content: 'Loading shows'});

        if (show.event === null){
            // Create
            CinemairSrv.createEvent(show.id).then(function() {
                CinemairSrv.getShows().success(function(shows) {
                    $scope.shows = _.groupBy(shows, function(show) {
                        return moment(show.datetime).format('Do MMM YYYY');
                    });
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteEvent(show.event).then(function() {
                CinemairSrv.getShows().success(function(shows) {
                    $scope.shows = _.groupBy(shows, function(show) {
                        return moment(show.datetime).format('Do MMM YYYY');
                    });
                    $ionicLoading.hide();
                });
            });
        }
    };
})


/******************************************************/
/* Movies Controller
/******************************************************/
.controller('MoviesCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        UserSrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading movies'});

    CinemairSrv.getMovies().success(function(movies) {
        $scope.movies = movies;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });
})

.controller('MovieDetailCtrl', function($scope, $ionicLoading, $ionicBackdrop, $ionicSlideBoxDelegate, $stateParams, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        UserSrv.logout();
    };

    $scope.movieIndex = $stateParams.index;

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading movies'});

    CinemairSrv.getMovies().success(function(movies) {
        $scope.movies = movies;
        CinemairSrv.getMovieShows($scope.movies[$scope.movieIndex].id).success(function(movieShows) {
            $scope.shows = movieShows;
            $ionicSlideBoxDelegate.update();

            $ionicLoading.hide();
            $ionicBackdrop.release();
        });
    });

    $scope.slideHasChanged = function(index) {
        $ionicLoading.show({
            content: 'Loading movies'
        });

        CinemairSrv.getMovieShows($scope.movies[index].id).success(function(movieShows) {
            $scope.shows = movieShows;
            $ionicLoading.hide();
        });
    }

    $scope.toggleShow = function(show) {
        $ionicLoading.show({content: 'Loading shows'});

        if (show.event === null){
            // Create
            CinemairSrv.createEvent(show.id).then(function() {
                CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteEvent(show.event).then(function() {
                CinemairSrv.getMovieShows(movieId).success(function(movieShows) {
                    $scope.shows = movieShows;
                    $ionicLoading.hide();
                });
            });
        }
    };
})


/******************************************************/
/* Cinemas Controller
/******************************************************/
.controller('CinemasCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        UserSrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({
        content: 'Loading cinemas'
    });

    CinemairSrv.getCinemas().success(function(cinemas) {
        $scope.cinemas = cinemas;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });
})


/******************************************************/
/* Schedele Controller
/******************************************************/
.controller('ScheduleCtrl', function($scope, $ionicLoading, $ionicBackdrop, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        UserSrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading events'});

    CinemairSrv.getEvents().success(function(events) {
        $scope.events = events;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });
    $scope.deleteEvent = function(event) {
        $ionicLoading.show({content: 'Loading shows'});

        // Delete
        CinemairSrv.deleteEvent(event.id).then(function() {
            CinemairSrv.getEvents().success(function(events) {
                $scope.events = events;
                $ionicLoading.hide();
            });
        });
    };
})

.controller('ScheduleDetailCtrl', function($scope, $ionicLoading, $ionicBackdrop, $stateParams, CinemairSrv, UserSrv) {
    $scope.logout = function(){
        UserSrv.logout();
    };

    $ionicBackdrop.retain();
    $ionicLoading.show({content: 'Loading movies'});

    var EventID = $stateParams.id;

    CinemairSrv.getSingleShow(EventID).success(function(show) {
        $scope.show = show;

        $ionicLoading.hide();
        $ionicBackdrop.release();
    });

    $scope.toggleShow = function(show) {
        $ionicLoading.show({content: 'Loading movies'});

        if (show.event === null){
            // Create
            CinemairSrv.createEvent(show.id).then(function() {
                CinemairSrv.getSingleShow(EventID).success(function(show) {
                    $scope.show = show;
                    $ionicLoading.hide();
                });
            });
        }
        else {
            // Delete
            CinemairSrv.deleteEvent(show.event).then(function() {
                CinemairSrv.getSingleShow(EventID).success(function(show) {
                    $scope.show = show;
                    $ionicLoading.hide();
                });
            });
        }
    };
});
