var angular = require('angular')
var moment = require('moment')

require('./datePicker.js')
require('./timePicker.js')

angular.module('app').directive('dateTimePicker', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: require('./dateTimePicker.html'),
        scope: { },
        controller: function($scope) {
            var ctrl = this

            ctrl.order = {
                requestedDatetime: null,
                // requestedDatetime: moment(),
                timeZone: 'America/Los_Angeles'
            }

            ctrl.updateDate = function(date) {
                ctrl.requestedDate = date
                $scope.$broadcast("dateSelected")
            }

            ctrl.updateTime = function(time) { //can be null, if date changed
                                               //and prev selected time is now
                                               //a closed time
                ctrl.requestedTime = time
            }

        },
        link: {
            pre: function($scope, elem, attrs, ctrl) {

                $scope.check = function() {
                    console.log($scope.order.requestDatetime)
                }

            },
            post: function() {}
        }
    }
})
