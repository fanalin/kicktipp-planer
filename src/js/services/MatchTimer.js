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

        that.isActive = function() {
            return that.isFirstHalf() || that.isSecondHalf();
        };

        that.isMatchStarted = function() {
            return !! getTickerEntry('start');
        };

        that.isFirstHalf = function() {
            // first half is when match is started and halftime is not reached
            return that.isMatchStarted() && ! getTickerEntry('finish-first-half');
        };

        that.isHalftime = function() {
            // halftime: first half finished, second half not kicked off
            return getTickerEntry('finish-first-half') && ! getTickerEntry('start-second-half');
        };

        that.isSecondHalf = function() {
            return getTickerEntry('start-second-half') && ! getTickerEntry('end');
        };

        that.isEndResult = function() {
            return !! getTickerEntry('end');
        };

        that.isMatchInNormalTime = function() {
            return that.isActive() && that.currentTime.extraTime == 0;
        };

        that.isMatchInExtraTime = function() {
            return that.isActive() && that.currentTime.extraTime > 0;
        };

        /* remove from here on */
        that.startMatch = function() {
            match.startMatch(that.currentTime);
        };

        that.finishFirstHalf = function() {
            match.finishFirstHalf(that.currentTime);
        };

        that.startSecondHalf = function() {
            /*
             Prevent small UI glitch.
             The glitch is following: the second half gets started, and for a small duration the
             extraTime of the first half gets displayed (until the currentTime gets updated).
             */
            tickerCache['start-second-half'] = {
                logTime : Math.floor(Date.now() / 1000)
            };
            that.currentTime = getCurrentTime();
            match.startSecondHalf(that.currentTime);
        };

        that.finishMatch = function() {
            match.finishMatch(that.currentTime);
        };

        that.getRemainingNormalTime = function() {
            return config.halftimeLength - that.currentTime.normalTime;
        };
        /* remove from until here */

        function getCurrentTime() {
            if (! that.isMatchStarted()) {
                return { normalTime: 0, extraTime: 0 };
            }

            if (that.isHalftime()) {
                var startHalftime = getTickerEntry('finish-first-half');
                var startMatch = getTickerEntry('start');
                return getTimeFromTickerEntries(startMatch, startHalftime);
            }
            if (that.isEndResult()) {
                var startSecondHalf = getTickerEntry('start-second-half');
                var finishMatch = getTickerEntry('end');
                return getTimeFromTickerEntries(startSecondHalf, finishMatch);
            }

            var startEntry = getTickerEntry(that.isSecondHalf() ? 'start-second-half' : 'start');
            var now = { logTime : Math.floor(Date.now() / 1000) };
            return getTimeFromTickerEntries(startEntry, now);
        }

        function getTimeFromTickerEntries(startEntry, endEntry) {
            var normalTime = endEntry.logTime - startEntry.logTime;
            var extraTime = 0;
            if (normalTime > config.halftimeLength) {
                extraTime = normalTime - config.halftimeLength;
                normalTime = config.halftimeLength;
            }

            return {
                normalTime: normalTime,
                extraTime: extraTime
            };
        }

        var tickerCache = {};
        /**
         * returns first ticker entry with given type
         * @param type the type to find
         * @returns TickerEntry
         */
        function getTickerEntry(type) {
            if (tickerCache[type] != undefined) {
                return tickerCache[type];
            }
            if (! match.matchData || ! match.matchData.ticker) {
                return undefined;
            }

            tickerCache[type] = undefined;

            for (var key in match.matchData.ticker) {
                if (match.matchData.ticker.hasOwnProperty(key)) {
                    var tickerEntry = match.matchData.ticker[key];
                    if (tickerEntry.type == type) {
                        tickerCache[type] = tickerEntry;
                    }
                }
            }

            return tickerCache[type];
        }

        function timeTick() {
            that.currentTime = getCurrentTime();
        }

        that.currentTime = getCurrentTime();
        $interval(timeTick, 1000);
    }

})(angular.module('tippkick-planer-app'));
