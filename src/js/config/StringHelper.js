
angular.module('tippkick-planer-app')
    .value('stringHelper', {
        leftPad: function (mystring, paddingValue) {
            return String(paddingValue + mystring).slice(-1 * paddingValue.length);
        }
    });
