
angular
    .module('tippkick-planer-app')
    .component('tournamentLoginCreate', {
            templateUrl: '/js/components/login/tournament-login-create.html',
            controller: ['firebase', function (firebase) {
                var that = this;
                that.loginWithPassword = function() {
                    firebase.auth().createUserWithEmailAndPassword(that.eMail, that.userPassword)
                        .catch(function(err) {
                            window.alert("Ein Fehler ist aufgetreten!");
                        })
                };
            } ]
        }
    );

