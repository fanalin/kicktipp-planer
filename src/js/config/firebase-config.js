
(function(angular, firebase) {
    var config = {
        apiKey: "AIzaSyABMFdONBwq1Tc-jlhS2cbYGGuZUg2Xuec",
        authDomain: "tippkick-planer-test.firebaseapp.com",
        databaseURL: "https://tippkick-planer-test.firebaseio.com",
        storageBucket: "tippkick-planer-test.appspot.com",
    };
    firebase.initializeApp(config);

    angular.module('tippkick-planer-app').value('firebase', firebase);
})(angular, firebase);
