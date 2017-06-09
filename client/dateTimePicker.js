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
        link: {
            pre: function($scope, elem, attrs, ctrl) {

                $scope.datetime = moment()

                $scope.check = function() {
                    console.log($scope.datetime)
                }

            },
            post: function() {}
        }
    }
})
