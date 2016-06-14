
angular.module('tippkick-planer-app')
    .run(function($rootScope, $location, firebase) {
        // go to /home when doing login
        // go to /login when doing logout
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $location.path('/home');
            } else {
                $location.path('/login');
            }
            $rootScope.safeApply();
        });
    });

