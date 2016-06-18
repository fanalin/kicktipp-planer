
angular
    .module('tippkick-planer-app')
    .component('tournamentLoginGoogle', {
            template: '<a href="#" ng-click="$ctrl.login()"><img src="/img/google-login-banner.png" /></a>',
            controller: ['firebase', '$location', function(firebase, $location) {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/plus.login');

                function goToHome() {
                    $location.path('/home');
                }

                this.login = function() {
                    firebase.auth().signInWithPopup(provider)
                        .then(goToHome)
                        .catch(function(err) {
                            firebase.auth().signInWithRedirect(provider)
                                .then(goToHome)
                                .catch(function(err) {
                                    console.log('Login mit Google nicht möglich!');
                                });
                        });
                };
            }]
        }
    );

