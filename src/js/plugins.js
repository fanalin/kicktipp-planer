// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    if (! Array.prototype.shuffle) {
        Array.prototype.shuffle = function(array) {
            for (var i = this.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = this[i];
                this[i] = this[j];
                this[j] = temp;
            }
            return array;
        };
    }
}());

// navigation toggle functionality
(function() {
    window.addEventListener('click', function(evt) {
        if (! evt.target) {
            return;
        }

        if (! evt.target.dataset.toggleTarget || ! evt.target.dataset.toggleClass) {
            return;
        }
        var targetSelector = evt.target.dataset.toggleTarget;
        var toggleTarget = document.querySelector(targetSelector);
        if (! toggleTarget) {
            return;
        }

        toggleTarget.classList.toggle(evt.target.dataset.toggleClass);
    });
})();

(function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            // Registration was successful
            //console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    }
})();

