(function(mod) {

    mod.factory('notificationPush', ['firebase', '$http', function(firebase, $http) {
        var subscriptions = [];

        firebase.database().ref('/push-notification').on('value', function(notifSnapshot) {
            subscriptions = [];
            angular.forEach(notifSnapshot.val(), function(val, key) {
               if (val.subscribed) {
                   subscriptions.push(key);
               }
            });
        });

        function sendNotification(payload) {
            $http({
                method : 'POST',
                url : 'https://android.googleapis.com/gcm/send',
                headers : {
                    "Authorization": "key=AIzaSyABMFdONBwq1Tc-jlhS2cbYGGuZUg2Xuec",
                    "Content-Type": "application/json"
                },
                data : {
                    "registration_ids" : subscriptions,
                    "data" : payload
                }
            }).then(console.log, console.log);
        }

        function notifyMatchStart(tournamentId, groupId, matchId) {

            // TODO
            // encryption of data payload not yet implemented. Send w/o payload.
            // notification display in src/service-worker.js just displays this message
            // constantly.
            sendNotification({
                url : "http://tippkick-planer.firebaseapp.com/#!/tournament/" + tournamentId + "/ticker/" + groupId + "/" + matchId,
                title : "Match beginnt",
                message : "Match beginnt"
            });
        }

        return {
            notifyMatchStart : notifyMatchStart
        };
    }]);

})(angular.module('tippkick-planer-app'));
