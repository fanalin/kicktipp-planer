
angular
    .module('tippkick-planer-app')
    .component('tournamentMatchCapture', {
        templateUrl: '/js/components/tournament-match-capture.html',
        controller: ['$attrs', 'tournamentMatchRepository', '$location', '$interval',
            function ($attrs, tournamentMatchRepository, $location, $interval) {
            var that = this;

            var halftimeLength = 300;

            that.tournamentId = $attrs.tournamentId;
            that.remainingTime = halftimeLength;
            that.currentHalf = 1;

            that.isHalftime = false;
            that.isEndResult = false;
            that.timerActive = false;

            that.match = tournamentMatchRepository.get(
                $attrs.tournamentId,
                $attrs.groupId,
                $attrs.matchId
            );

            that.startMatch = function() {
                that.match.startMatch();
                that.currentHalf == 1;

                startTimer();
            };

            that.startSecondHalf = function() {
                that.currentHalf = 2;

                startTimer();
            }

            function startTimer() {
                that.isHalftime = false;
                that.isEndResult = false;
                that.timerActive = true;
                that.remainingTime = halftimeLength;

                $interval(function() {
                    if (that.remainingTime > 0) {
                        that.remainingTime--;
                    } else {
                        finishHalf();
                    }
                }, 1000, halftimeLength+1);
            }

            function finishHalf() {
                that.timerActive = false;
                if (that.currentHalf == 1) {
                    that.isHalftime = true;
                } else {
                    that.isEndResult = true;
                }
            }

            that.finishMatch = function() {
                that.match.finishMatch();
                $location.path('/tournament/' + that.tournamentId);
            };
        } ]
    });

