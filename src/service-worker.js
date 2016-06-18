self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('push', function(event) {
    event.waitUntil(
        self.registration.showNotification(
            'Match beginnt!',
            {
                body: 'Ein Match hat gerade begonnen',
                icon: 'img/icon-192.png',
                tag: 'https://tippkick-planer.firebaseapp.com/#!/tournament/-KJ6vf2RJwQuwR072lIg'
            }
        )
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    console.log(event);

    event.waitUntil(openUrl(event.notification.tag));
});

function openUrl(url) {
    return clients.matchAll({
        type: 'window'
    })
    .then(function(windowClients) {
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(url);
        }
    });
}
