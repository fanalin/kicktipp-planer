(function(mod) {

    mod.factory('currentUser', ['firebase', '$rootScope', function (firebase, $rootScope) {

        /**
         * the object holding the current user-info
         */
        var currentUserReference = {
            userInfo : null
        };

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
                currentUserReference.userInfo = null;
            }
        });

        return currentUserReference;

        function registerUserInfoListener(uid) {
            // detach old listeners
            if (currentUserRef) {
                currentUserRef.off();
            }

            currentUserRef = firebase.database().ref('/userinfo/' + uid);
            currentUserRef.on('value', function (userSnapshot) {
                currentUserReference.userInfo = userSnapshot.val();
                $rootScope.safeApply();
            });
        }
    }]);

})(angular.module('tippkick-planer-app'));
