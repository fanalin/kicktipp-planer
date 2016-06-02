
(function(angular, firebase) {
    var config = {
        apiKey: "AIzaSyCbjZ0v15_9e-wlBYdp7g3nqkSNEfkDql8",
        authDomain: "tippkick-planer.firebaseapp.com",
        databaseURL: "https://tippkick-planer.firebaseio.com",
        storageBucket: "",
    };
    firebase.initializeApp(config);

    angular.module('tippkick-planer-app').value('firebase', firebase);
})(angular, firebase);
