
angular
    .module('tippkick-planer-app')
    .component('tournamentLogout', {
            template: '<button type="button" ng-click="$ctrl.logout()">Logout</button>',
            controller: ['$scope', 'firebase', function ($scope, firebase) {

                this.logout = function() {
                    firebase.auth().signOut()
                        .then(function() {
                            console.log('logged out');
                            $scope.$apply();
                        })
                        .catch(function(err) {
                            window.alert("Ein Fehler ist aufgetreten!");
                        });

                };
            } ]
        }
    );

