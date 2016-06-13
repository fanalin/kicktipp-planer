
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

            that.deleteResult = function(groupId, matchId) {
                var matchKey = '/tournaments/' + $attrs.tournamentId
                    + '/groups/' + groupId
                    + '/matches/' + matchId;
                firebase.database().ref(matchKey + '/played').set(false);
                firebase.database().ref(matchKey + '/ticker').remove();
                firebase.database().ref(matchKey + '/home/goals').set(0);
                firebase.database().ref(matchKey + '/away/goals').set(0);
            };
        } ],
        bindings : {
            tournamentId : '<'
        }
    });

