(function(mod) {

    mod.factory('matchTimerFactory', ['config', '$interval', function (config, $interval) {

        return {
            get: function(match) {
                return new MatchTimer(config, match, $interval);
            }
        };
    }]);

    function MatchTimer(config, match, $interval) {
        var that = this;

        that.isHalftime = false;
        that.isEndResult = false;
        that.active = false;
        that.remainingTime = 0;
        that.currentHalf = 1;
        that.currentTimer = null;

        that.startMatch = function() {
            match.startMatch();
            that.currentHalf = 1;

            startTimer();
        };

        that.finishFirstHalf = function() {
            finishHalf();
            match.finishFirstHalf(this.getCurrentTime());
        };

        that.startSecondHalf = function() {
            that.currentHalf = 2;
            match.startSecondHalf(that.getCurrentTime());

            startTimer();
        };

        that.finishMatch = function() {
            finishHalf();
            match.finishMatch(that.getCurrentTime());
        };

        that.getCurrentTime = function() {
            if (that.isHalftime) {
                return config.halftimeLength;
            }
            if (that.isEndResult) {
                return 2*config.halftimeLength;
            }
            var durInHalf = config.halftimeLength - that.remainingTime;
            var durPreviousHalf = (that.currentHalf - 1) * config.halftimeLength;
            return durInHalf - durPreviousHalf;
        };

        function startTimer() {
            that.isHalftime = false;
            that.isEndResult = false;
            that.active = true;
            that.remainingTime = config.halftimeLength;

            that.currentTimer = $interval(function() {
                if (that.remainingTime > 0) {
                    that.remainingTime--;
                }
            }, 1000, config.halftimeLength+1);
        }

        function finishHalf() {
            if (that.currentTimer) {
                $interval.cancel(that.currentTimer);
            }

            that.active = false;
            if (that.currentHalf == 1) {
                that.isHalftime = true;
            } else {
                that.isEndResult = true;
            }
        }
    }

})(angular.module('tippkick-planer-app'));
