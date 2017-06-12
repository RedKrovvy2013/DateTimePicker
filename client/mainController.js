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

    var tz1 = moment.tz("2017-12-18 11:55", tz)
    // var tz1 = moment()
    // console.log(tz1.format())
    // console.log(tz1)

    // console.log(moment.tz.names())

    $scope.order = {
        requestedDatetime: null,
        // requestedDatetime: moment().month(6).hour(11).minute(15),
        // requestedDatetime: moment.tz("2013-11-18 11:55", tz),
        timeZone: tz
    }
    $scope.check = function() {
        console.log($scope.order.requestedDatetime)
        console.log($scope.order.requestedDatetime.format())
    }
    $scope.changeTimeZone = function() {
        $scope.order.timeZone = "Australia/Melbourne"
    }
})
