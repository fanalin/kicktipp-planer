
angular
    .module('tippkick-planer-app')
    .component('tournamentMatchTicker', {
        templateUrl: '/js/components/tournament-match-ticker.html',
        controller: ['firebase', '$attrs', '$rootScope', function (firebase, $attrs, $rootScope) {
            var that = this;

            that.tournamentId = $attrs.tournamentId;
            var matchKey = '/tournaments/' + $attrs.tournamentId
                + '/groups/' + $attrs.groupId
                + '/matches/' + $attrs.matchId;

            var matchRef = firebase.database().ref(matchKey);
            matchRef.on('value', function(matchSnapshot) {
                that.match = matchSnapshot.val();
                $rootScope.safeApply();
            });

            that.getMatchDate = function() {
                if (! that.match || ! that.match.ticker) {
                    return null;
                }

                var firstEntry = null;
                angular.forEach(that.match.ticker, function(item) {
                   if (firstEntry == null || firstEntry.logTime > item.logTime) {
                       firstEntry = item;
                   }
                });
                return firstEntry.logTime;
            };
        } ]
    });

