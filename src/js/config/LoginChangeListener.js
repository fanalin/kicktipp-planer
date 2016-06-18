
angular.module('tippkick-planer-app')
    .run(function($rootScope, $location, firebase) {
        // go to /login when doing logout
        firebase.auth().onAuthStateChanged(function(user) {
            if (! user) {
                $location.path('/login');
            } else if ($location.path() == '/login') {
                $location.path('/home');
            }
            $rootScope.safeApply();
        });
    });

