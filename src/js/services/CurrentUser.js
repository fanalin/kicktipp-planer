(function(mod) {

    mod.factory('currentUser', ['firebase', '$rootScope', function (firebase, $rootScope) {

        /**
         * the object holding the current user-info
         */
        var currentUser = {};

        /**
         * the firebase reference while listening to auth changes.
         * Cached s.t. it can be detached when changing user info
         * @type {null}
         */
        var currentUserRef = null;

        // if we already have a user at this point, load the user info
        if (firebase.currentUser != null) {
            registerUserInfoListener(firebase.currentUser.uid);
        }

        // register auth state listener to update user-info when current user changes
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                registerUserInfoListener(user.uid);
            } else {
                clearUserInfo();
            }
        });

        return currentUser;

        function clearUserInfo() {
            angular.forEach(currentUser, function(val, key) {
                delete currentUser[key];
            });
        }

        function registerUserInfoListener(uid) {
            // detach old listeners
            if (currentUserRef) {
                currentUserRef.off();
            }

            currentUserRef = firebase.database().ref('/userinfo/' + uid);
            currentUserRef.on('value', function (userSnapshot) {
                clearUserInfo();
                angular.merge(currentUser, userSnapshot.val());
                $rootScope.safeApply();
            });
        }
    }]);

})(angular.module('tippkick-planer-app'));
