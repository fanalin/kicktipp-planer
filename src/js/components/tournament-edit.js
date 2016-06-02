
angular
    .module('tippkick-planer-app')
    .component('tournamentEdit', {
            templateUrl: '/js/components/tournament-edit.html',
            controller: function($scope, tournamentRepository, $location, $attrs) {
                var that = this;

                this.save = function() {
                    tournamentRepository.save(that.tournament);
                    $location.path('/tournament/' + that.tournament.id);
                };

                var setTournament = function (tournament) {
                    that.tournament = tournament;
                };

                // load tournament if tournamentId was given in attribute 'tournament-id'
                if ($attrs.tournamentId) {
                    tournamentRepository.getTournamentById($attrs.tournamentId, setTournament);
                } else {
                    tournamentRepository.createTournament(setTournament);
                }
            },
            bindings : {
                tournamentId : '<'
            }
        }
    );
