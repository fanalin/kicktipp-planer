(function(mod) {

    mod.factory('config', ['firebase', '$rootScope', function (firebase, $rootScope) {

        var config = {};

        firebase.database().ref('/config').once('value', function (configSnapshot) {
            angular.merge(config, configSnapshot.val());
            $rootScope.safeApply();
        });

        return config;
    }]);

})(angular.module('tippkick-planer-app'));
