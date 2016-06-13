
angular
    .module('tippkick-planer-app')
    .component('tournamentOverview', {
        templateUrl: '/js/components/tournament-overview.html',
        controller: ['currentUser', '$attrs', 'firebase', function (currentUser, $attrs, firebase) {
            var that = this;
            that.currentUser = currentUser;

            firebase.database().ref('/tournaments/' + $attrs.tournamentId)
                .on('value', function(tournament) {
                that.tournament = tournament.val();
            });
        } ],
        bindings : {
            tournamentId : '<'
        }
    });

