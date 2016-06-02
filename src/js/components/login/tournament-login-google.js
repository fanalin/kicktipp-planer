
angular
    .module('tippkick-planer-app')
    .component('tournamentLoginGoogle', {
            template: '<a href="#" ng-click="$ctrl.login()"><img src="/img/web/1x/btn_google+_signin_dark_normal_web.png" /></a>',
            controller: ['firebase', '$scope', function(firebase, $scope) {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/plus.login');

                this.login = function() {
                    firebase.auth().signInWithPopup(provider)
                        .then(function() {
                            $scope.$apply();
                            console.log('logged in');
                        })
                        .catch(function (err) {
                            console.log(err);
                            window.alert("Ein Fehler ist aufgetreten!");
                        });
                };
            }]
        }
    );

