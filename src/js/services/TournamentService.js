(function(mod) {

    mod.factory('tournamentRepository', ['firebase', 'tournamentFactory', 'tournamentToFirebaseConverter', function (firebase, tournamentFactory, tournamentToFirebaseConverter) {


        return {
            getTournamentById : function(id, cb) {
                firebase.database().ref('/tournaments/' + id).once('value', function(fbTournament) {
                    cb(tournamentFactory.fromFirebaseObject(fbTournament.val()));
                });
            },
            createTournament : function(cb) {
                cb(tournamentFactory.getNew());
            },
            save : function(tournament) {
                var fbTournament = tournamentToFirebaseConverter(tournament);
                firebase.database().ref('/tournaments/' + fbTournament.id).set(fbTournament);
            }
        };

    }]);

    mod.factory('tournamentFactory', function() {

        var tournamentConverter = function(fbTournament) {
            var tournament = new Tournament(fbTournament.id, fbTournament.name);

            angular.forEach(fbTournament.groups, function(fbGroup) {
                var group = new Group(tournament, fbGroup.name, fbGroup.id);
                tournament.groups.push(group);

                angular.forEach(fbGroup.players, function(fbPlayer) {
                    var player = new Player(group, fbPlayer.name, fbPlayer.id);
                    group.players.push(player);
                });
            });

            return tournament;
        };

        return {
            getNew : function() {
                return new Tournament();
            },
            fromFirebaseObject : tournamentConverter
        };
    });

    mod.factory('tournamentToFirebaseConverter', ['firebase', function(firebase) {
        var tournamentsRef = firebase.database().ref('/tournaments');

        var getGroups = function(tournament) {
            var groupsRef = firebase.database().ref('/tournaments/' + tournament.id).child('groups');
            var fbGroups = {};
            angular.forEach(tournament.groups, function(group) {
                if (! group.id) {
                    group.id = groupsRef.push().key;
                }

                fbGroups[group.id] = {
                    id : group.id,
                    name : group.name,
                    players : getPlayers(tournament, group),
                    matches : createMatchesForGroup(tournament, group)
                };
            });
            return fbGroups;
        };

        var getPlayers = function(tournament, group) {
            var playersRef = firebase.database().ref('/tournaments/' + tournament.id + '/groups/' + group.id).child('players');
            var fbPlayers = {};
            angular.forEach(group.players, function(player) {
               if (! player.id) {
                   player.id = playersRef.push().key;
               }

               fbPlayers[player.id] = {
                   id : player.id,
                   name : player.name,
                   points : player.points,
                   goals : player.goals,
                   goalsAgainst : player.goalsAgainst,
                   rank : player.rank,
                   goalDiff : 0
               };
            });
            return fbPlayers;
        };

        var createMatch = function(matchesRef, homePlayer, awayPlayer) {
            return {
                id : matchesRef.push().key,
                home : {
                    name : homePlayer.name,
                    id : homePlayer.id,
                    goals: 0
                },
                away : {
                    name : awayPlayer.name,
                    id : awayPlayer.id,
                    goals: 0
                },
                played : false
            };
        };

        var createMatchesForGroup = function(tournament, group) {
            var matchesRef = firebase.database().ref('/tournaments/' + tournament.id + '/groups/' + group.id).child('matches');
            var fbMatches = {};
            for (var i = 0, len = group.players.length; i < len; ++i) {
                var homePlayer = group.players[i];
                for (var j = i+1; j < len; ++j) {
                    var awayPlayer = group.players[j];
                    var fbMatch = createMatch(matchesRef, homePlayer, awayPlayer);
                    fbMatches[fbMatch.id] = fbMatch;
                }
            }
            return fbMatches;
        };

        return function(tournament) {
            if (! tournament.id) {
                tournament.id = tournamentsRef.push().key;
            }

            return {
                id : tournament.id,
                name : tournament.name,
                groups : getGroups(tournament)
            }

        };

    }]);

    function Tournament(id, name) {
        this.id = id;
        this.name = name;
        this.groups = [];
    }

    Tournament.prototype.addGroup = function() {
        this.groups.push(new Group());
    };

    function Group(tournament, name, id) {
        this.id = id;
        this.tournament = tournament;
        this.name = name;
        this.players = [];
    }

    Group.prototype.addPlayer = function() {
        this.players.push(new Player(this));
    };

    Group.prototype.remove = function() {
        var myTournament = this.tournament;
        this.tournament = undefined;

        var index = myTournament.groups.indexOf(this);
        myTournament.groups.splice(index, 1);
    };

    function Player(group, name, id) {
        this.id = id;
        this.group = group;
        this.name = name;
        this.points = 0;
        this.goals = 0;
        this.goalsAgainst = 0;
        this.rank = 1;
    }

    Player.prototype.remove = function() {
        var myGroup = this.group;
        this.group = undefined;

        var index = myGroup.players.indexOf(this);
        myGroup.players.splice(index, 1);
    }
})(angular.module('tippkick-planer-app'));
