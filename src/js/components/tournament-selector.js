
angular
    .module('tippkick-planer-app')
    .component('tournamentSelector', {
        templateUrl: '/js/components/tournament-selector.html',
        controller: ['$rootScope', 'firebase', 'currentUser', function ($rootScope, firebase, currentUser) {
            var that = this;
            that.currentUser = currentUser;

            firebase.database().ref('/tournaments').on('value', function(tournaments) {
                that.tournaments = tournaments.val();
                $rootScope.safeApply();
            });
        } ]
    });

