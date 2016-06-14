
angular.module('tippkick-planer-app').filter('timeFormatter', ['stringHelper',
    function(stringHelper) {
    return function(value) {
        if (! value) {
            return "";
        }
        var date = new Date(value * 1000);

        return      stringHelper.leftPad(date.getHours(), '00')
            + ':' + stringHelper.leftPad(date.getMinutes(), '00')
            + ':' + stringHelper.leftPad(date.getSeconds(), '00');
    };
}]);


angular.module('tippkick-planer-app').filter('dateFormatter', ['stringHelper',
    function(stringHelper) {
        return function(value) {
            if (! value) {
                return "";
            }
            var date = new Date(value * 1000);

            return stringHelper.leftPad(date.getDate(), '00')
            + '.' + stringHelper.leftPad(1+date.getMonth(), '00');
};
}]);
