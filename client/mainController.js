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

    $scope.beforeRenderTimeItem = function(time) {
        time.disabled = (function() {
            if( time.day() === 0 ||
                time.day() === 6 ) { //weekend
                    if(time.hour() >= 10 &&
                       time.hour() < 16)
                          return false
                    else
                          return true
            } else { //weekday
                    if(time.hour() >= 7 &&
                       time.hour() < 20)
                          return false
                    else
                          return true
            }
        })()
    }

    $scope.beforeRenderDateItem = function(date) {
        var timeZone = date._z.name
        if(date.year() < moment().tz(timeZone).year())
            date.disabled = true
        else if(date.year() > moment().tz(timeZone).year())
            date.disabled = false
        else //years are same, so compare days of year
            date.disabled = date.dayOfYear() < moment().tz(timeZone).dayOfYear()
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
