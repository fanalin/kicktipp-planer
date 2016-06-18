
(function(mod) {

    mod.factory('serviceWorker', [ 'firebase', function(firebase) {
        var serviceWorkerService = {
            registration : null,
            pushNotificationSubscription : null
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                serviceWorkerService.registration = registration;
                registration.pushManager.subscribe({
                    userVisibleOnly: true
                }).then(function(sub) {
                    var key = sub.endpoint.substring(sub.endpoint.indexOf('/send/') + 6);
                    serviceWorkerService.pushNotificationSubscription = {
                        subscription: sub,
                        key : key
                    };

                    firebase.database().ref('/push-notification/' + key).set({ subscribed : true });
                });
            }).catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        }

        return serviceWorkerService;
    }]);

    // force initialization of service worker, even if it is not used in the current screen
    mod.run(['serviceWorker', function(serviceWorker) {}]);

})(angular.module('tippkick-planer-app'));

