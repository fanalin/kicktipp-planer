
angular
    .module('tippkick-planer-app')
    .component('tournamentOverview', {
        templateUrl: '/js/components/tournament-overview.html',
        controller: ['$attrs', 'firebase', function ($attrs, firebase) {
            var that = this;

            firebase.database().ref('/tournaments/' + $attrs.tournamentId)
                .on('value', function(tournament) {
                that.tournament = tournament.val();
            });
        } ],
        bindings : {
            tournamentId : '<'
        }
    });

