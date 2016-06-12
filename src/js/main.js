
angular.module('tippkick-planer-app', [ 'ngRoute' ])
    .config(['$locationProvider', '$routeProvider',
        function ($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
            when('/login', {
                template: '<tournament-login></tournament-login>'
            }).
            when('/about', {
                template: '<tournament-about></tournament-about>'
            }).
            when('/create-account', {
                template: '<tournament-login-create></tournament-login-create>'
            }).
            when('/home', {
                template: '<tournament-selector></tournament-selector>'
            }).
            when('/tournament/create', {
                template: '<tournament-edit></tournament-edit>'
            }).
            when('/tournament/:tournamentId/edit', {
                template: function($routeParams) { return '<tournament-edit tournament-id="' + $routeParams.tournamentId + '"></tournament-edit>' }
            }).
            when('/tournament/:tournamentId', {
                template: function($routeParams) { return '<tournament-overview tournament-id="' + $routeParams.tournamentId + '"></tournament-overview>' }
            }).
            when('/tournament/:tournamentId/capture-match/:groupId/:matchId', {
                template: function($routeParams) { return '<tournament-match-capture tournament-id="' + $routeParams.tournamentId + '" group-id="' + $routeParams.groupId + '" match-id="' + $routeParams.matchId + '"></tournament-match-capture>' }
            }).
            otherwise('/login');
        }
    ])
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

        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
    });

angular.module('tippkick-planer-app').filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return a[field] - b[field];
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});


