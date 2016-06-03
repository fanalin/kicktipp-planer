
angular
    .module('tippkick-planer-app')
    .component('tournamentMatchCapture', {
        templateUrl: '/js/components/tournament-match-capture.html',
        controller: ['$attrs', 'tournamentMatchRepository', '$location', function ($attrs, tournamentMatchRepository, $location) {
            var that = this;

            that.tournamentId = $attrs.tournamentId;

            that.match = tournamentMatchRepository.get(
                $attrs.tournamentId,
                $attrs.groupId,
                $attrs.matchId
            );

            that.finishMatch = function() {
                that.matchData.finishMatch();
                $location.path('/tournament/' + that.tournamentId);
            };
        } ]
    });

