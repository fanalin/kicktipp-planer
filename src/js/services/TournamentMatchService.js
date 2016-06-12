(function(mod) {

    mod.factory('tournamentMatchRepository', ['firebase', function (firebase) {
        return {
            get : function(tournamentId, groupId, matchId) {
                return new Match(firebase, tournamentId, groupId, matchId);
            }
        }
    }]);

    function Match(firebase, tournamentId, groupId, matchId) {
        var that = this;

        var matchKey = '/tournaments/' + tournamentId
            + '/groups/' + groupId
            + '/matches/' + matchId;

        firebase.database().ref(matchKey).on('value', function(snapshot) {
            that.matchData = snapshot.val();
        });

        this.startMatch = function() {
            // don't start match if it already began ('live') or is even finished ('finished')
            if (!! that.matchData.played) {
                return;
            }
            firebase.database().ref(matchKey + '/played').set('live');
        };

        this.finishMatch = function() {
            firebase.database().ref(matchKey + '/played').set('finished');
            recalculateStandings();
        };
        this.addGoalToHome = function() {
            var newGoalAmount = that.matchData.home.goals + 1;
            firebase.database().ref(matchKey + '/home/goals').set(newGoalAmount);
        };
        this.addGoalToAway = function() {
            var newGoalAmount = that.matchData.away.goals + 1;
            firebase.database().ref(matchKey + '/away/goals').set(newGoalAmount);
        };
        this.removeGoalFromHome = function() {
            var newGoalAmount = that.matchData.home.goals - 1;
            if (newGoalAmount < 0) {
                return;
            }
            firebase.database().ref(matchKey + '/home/goals').set(newGoalAmount);
        };
        this.removeGoalFromAway = function() {
            var newGoalAmount = that.matchData.away.goals - 1;
            if (newGoalAmount < 0) {
                return;
            }
            firebase.database().ref(matchKey + '/away/goals').set(newGoalAmount);
        };

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

        function updatePlayer(playerId, goalsScored, goalsAgainst) {
            var playerKey = '/tournaments/' + tournamentId + '/groups/' + groupId + '/players/' + playerId;
            var playerRef = firebase.database().ref(playerKey);
            playerRef.once('value', function (playerSnapshot) {
                var player = playerSnapshot.val();
                addToPlayer(player, goalsScored, goalsAgainst);
                playerRef.set(player);
            });
        }

        function recalculateStandings() {
            updatePlayer(that.matchData.home.id, that.matchData.home.goals, that.matchData.away.goals);
            updatePlayer(that.matchData.away.id, that.matchData.away.goals, that.matchData.home.goals);

            var playersRef = firebase
                .database()
                .ref('/tournaments/' + tournamentId + '/groups/' + groupId + '/players/');

            playersRef.once('value', updateRanking);

            function updateRanking(playersSnapshots) {
                var players = [];
                angular.forEach(playersSnapshots.val(), function(p) {
                    players.push(p);
                });
                players.sort(playerComparator);
                var i = 0;
                angular.forEach(players, function (player) {
                    firebase
                        .database()
                        .ref('/tournaments/' + tournamentId + '/groups/' + groupId + '/players/' + player.id + '/rank')
                        .set(++i);

                });
            }
        }

        function playerComparator(player1, player2) {
            var pointsDiff = player1.points - player2.points;
            if (pointsDiff != 0) {
                return -1 * pointsDiff;
            }
            var goalsDiffDiff = player1.goalDiff - player2.goalDiff;
            if (goalsDiffDiff != 0) {
                return -1 * goalsDiffDiff;
            }
            return player1.goals < player2.goals;
        }
    }


})(angular.module('tippkick-planer-app'));
