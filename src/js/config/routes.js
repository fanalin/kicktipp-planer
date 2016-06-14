angular.module('tippkick-planer-app')
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
            when('/tournament/:tournamentId/ticker/:groupId/:matchId', {
                template: function($routeParams) { return '<tournament-match-ticker tournament-id="' + $routeParams.tournamentId + '" group-id="' + $routeParams.groupId + '" match-id="' + $routeParams.matchId + '"></tournament-match-ticker>' }
            }).
            when('/tournament/:tournamentId/capture-match/:groupId/:matchId', {
                template: function($routeParams) { return '<tournament-match-capture tournament-id="' + $routeParams.tournamentId + '" group-id="' + $routeParams.groupId + '" match-id="' + $routeParams.matchId + '"></tournament-match-capture>' }
            }).
            otherwise('/login');
        }
    ]);
