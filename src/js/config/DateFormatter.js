(function(mod) {
    mod.filter('timeFormatter', ['stringHelper', function (stringHelper) {
        return function (value) {
            if (!value) {
                return "";
            }
            var date = new Date(value * 1000);

            return stringHelper.leftPad(date.getHours(), '00')
                + ':' + stringHelper.leftPad(date.getMinutes(), '00')
                + ':' + stringHelper.leftPad(date.getSeconds(), '00');
        };
    }]);

    mod.filter('dateFormatter', ['stringHelper', function (stringHelper) {
        return function (value) {
            if (!value) {
                return "";
            }
            var date = new Date(value * 1000);

            return stringHelper.leftPad(date.getDate(), '00')
                + '.' + stringHelper.leftPad(1 + date.getMonth(), '00');
        };
    }]);

    mod.filter('playTimeFormatter', ['stringHelper', function (stringHelper) {
        return function (value) {
            if (value == null) {
                return "";
            }
            // value is in seconds. We want to output m:ss.
            if (value == 0) {
                return "0:00";
            }

            var min = Math.floor(value / 60);
            var sec = value % 60;
            return min + ':' + stringHelper.leftPad(sec, '00');
        };
    }]);
})(angular.module('tippkick-planer-app'));
