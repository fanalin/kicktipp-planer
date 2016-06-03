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
        }
    }


})(angular.module('tippkick-planer-app'));
