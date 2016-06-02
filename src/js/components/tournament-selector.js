
angular
    .module('tippkick-planer-app')
    .component('tournamentSelector', {
        templateUrl: '/js/components/tournament-selector.html',
        controller: ['$rootScope', 'firebase', function ($rootScope, firebase) {
            var that = this;

            firebase.database().ref('/tournaments').on('value', function(tournaments) {
                that.tournaments = tournaments.val();
                $rootScope.safeApply();
            });
        } ]
    });

