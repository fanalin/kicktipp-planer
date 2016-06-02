
angular
    .module('tippkick-planer-app')
    .component('tournamentHeader', {
        templateUrl: '/js/components/tournament-header.html',
        controller: ['firebase', function (firebase) {
            var that = this;

            firebase.auth().onAuthStateChanged(function(user) {
                that.user = user;
            });
        } ]
        }
    );

