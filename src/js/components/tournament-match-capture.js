
angular
    .module('tippkick-planer-app')
    .component('tournamentMatchCapture', {
        templateUrl: '/js/components/tournament-match-capture.html',
        controller: ['$attrs', 'tournamentMatchRepository', 'matchTimerFactory',
            function ($attrs, tournamentMatchRepository, matchTimerFactory) {
            var that = this;

            that.tournamentId = $attrs.tournamentId;

            that.match = tournamentMatchRepository.get(
                $attrs.tournamentId,
                $attrs.groupId,
                $attrs.matchId
            );

            that.timer = matchTimerFactory.get(that.match);

        } ]
    });

