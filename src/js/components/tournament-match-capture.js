
angular
    .module('tippkick-planer-app')
    .component('tournamentMatchCapture', {
        templateUrl: '/js/components/tournament-match-capture.html',
        controller: ['$rootScope', '$attrs', 'firebase', '$location', function ($rootScope, $attrs, firebase, $location) {
            var that = this;

            var key = '/tournaments/' + $attrs.tournamentId
                + '/groups/' + $attrs.groupId
                + '/matches/' + $attrs.matchId;

            var matchRef = firebase.database().ref(key);

            matchRef.once('value', function(match) {
                that.match = match.val();
                $rootScope.safeApply();
            });

            this.captureResult = function() {
                that.match.played = true;
                matchRef.set(angular.copy(that.match));

                recalculateStandings(that.match);

                $location.path('/tournament/' + $attrs.tournamentId);
            };

            function recalculateStandings(playedMatch) {
                var playersKey = '/tournaments/' + $attrs.tournamentId + '/groups/' + $attrs.groupId + '/players';
                var playersRef = firebase.database().ref(playersKey);

                playersRef.once('value', function(playersSnapshot) {
                    var players = playersSnapshot.val();
                    angular.forEach(players, function(player) {
                        if (player.name == playedMatch.home.name) {
                            addToPlayer(player, playedMatch.home.goals, playedMatch.away.goals);
                        } else if (player.name == playedMatch.away.name) {
                            addToPlayer(player, playedMatch.away.goals, playedMatch.home.goals);
                        }
                    });
                    playersRef.set(players);
                });

                function addToPlayer(player, goalsScored, goalsAgainst) {
                    player.goals += goalsScored;
                    player.goalsAgainst += goalsAgainst;
                    player.goalDiff = goalsScored - goalsAgainst;

                    if (goalsScored > goalsAgainst) {
                        player.points += 3;
                    } else if (goalsScored == goalsAgainst) {
                        player.points += 1;
                    }

                }
            }
        } ]
    });

