var angular = require('angular')
var moment = require('moment-timezone')

angular.module('app').controller('mainController', function($scope) {

    // example time zones:
    // "Australia/Melbourne"
    // "Europe/Stockholm"
    // "America/Los_Angeles"
    // "America/Chicago"
    // "America/Phoenix" -> special cuz no observe dst
    // "America/Toronto"

    const tz = "Europe/Stockholm"

    var tz1 = moment.tz("2017-08-18 10:30", tz)
    // console.log(tz1.format())
    // console.log(tz1)

    $scope.beforeRenderDateItem = function(date) {
        date.disabled = date.month() > 10
    }

    $scope.beforeRenderTimeItem = function(time) {
        time.disabled = (time.hour() === 12)
                            //lunchtime!
    }

    $scope.order = {
        requestedDatetime: null,
        // requestedDatetime: moment.tz("2017-08-18 10:30", tz),
        timeZone: tz
    }
    $scope.check = function() {
        console.log($scope.order.requestedDatetime._z.name)
        console.log($scope.order.requestedDatetime.format())
    }
    $scope.changeTimeZone = function() {
        $scope.order.timeZone = "Australia/Melbourne"
    }
})
