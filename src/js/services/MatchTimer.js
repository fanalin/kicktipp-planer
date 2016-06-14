(function(mod) {

    mod.factory('matchTimerFactory', ['config', '$interval', function (config, $interval) {

        return {
            get: function(match) {
                return new MatchTimer(config, match, $interval);
            }
        };
    }]);

    function MatchTimer(config, match, $interval) {
        // inject config object instead of the halftimeLength because the config
        // object might not be fully initialized during creation of this object
        // (it it async. retrieved from firebase)

        var that = this;

        that.isHalftime = false;
        that.isEndResult = false;

        that.active = false;
        that.remainingTime = 0;
        that.currentHalf = 1;
        that.currentTimer = null;
        that.extraTime = 0;
        that.matchStarted = false;

        that.startMatch = function() {
            match.startMatch(that.getCurrentTime());

            that.matchStarted = true;
            that.currentHalf = 1;
            that.extraTime = 0;
            that.remainingTime = config.halftimeLength;

            startTimer();
        };

        that.finishFirstHalf = function() {
            that.isHalftime = true;
            finishTimer();
            match.finishFirstHalf(this.getCurrentTime());
        };

        that.startSecondHalf = function() {
            that.currentHalf = 2;
            that.isHalftime = false;
            that.extraTime = 0;
            that.remainingTime = config.halftimeLength;
            match.startSecondHalf(that.getCurrentTime());

            startTimer();
        };

        that.finishMatch = function() {
            that.isEndResult = true;
            finishTimer();
            match.finishMatch(that.getCurrentTime());
        };

        that.getCurrentTime = function() {
            // special cases (when halftime/end of match were reached before
            // time was up: halftime is always after halftimeLength, end of match
            // is always 2*halftimeLength
            if (that.isHalftime) {
                return {
                    normalTime: config.halftimeLength,
                    extraTime: that.extraTime
                };
            }
            if (that.isEndResult) {
                return {
                    normalTime: 2*config.halftimeLength,
                    extraTime: that.extraTime
                };
            }
            if (!that.matchStarted) {
                return {
                    normalTime: 0,
                    extraTime: 0
                };
            }
            var durInHalf = config.halftimeLength - that.remainingTime;
            var durPreviousHalf = (that.currentHalf - 1) * config.halftimeLength;
            return {
                normalTime: durInHalf + durPreviousHalf,
                extraTime: that.extraTime
            };
        };

        function startTimer() {
            that.active = true;

            that.currentTimer = $interval(function() {
                if (that.remainingTime > 0) {
                    that.remainingTime--;
                } else {
                    that.extraTime++;
                }
            }, 1000);
        }

        function finishTimer() {
            if (that.currentTimer) {
                $interval.cancel(that.currentTimer);
            }

            that.active = false;
        }
    }

})(angular.module('tippkick-planer-app'));
