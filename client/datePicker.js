var angular = require('angular')
var moment = require('moment')

angular.module('app').directive('datePicker', function() {
    return {
        restrict: 'E',
        template: require('./datePicker.html'),
        // scope: {
        //     datetime: '='
        // },
        link: function($scope, elem, attrs, ctrl) {

            $scope.datetime = moment()

            $scope.updateScope = function() {
                $scope.year = $scope.datetime.format('YYYY')
                $scope.month = $scope.datetime.format('MMM')
                $scope.updateMonthDays($scope.datetime.date()-1)
            }

            $scope.prevMonth = function() {
                $scope.datetime.add(-1, 'M')
                $scope.updateScope()
            }

            $scope.nextMonth = function() {
                $scope.datetime.add(1, 'M')
                $scope.updateScope()
            }

            $scope.updateMonthDays = function(day) {

                if(arguments.length > 0)
                    $scope.datetime.date(day+1)
                    //day is 0-based while date() is not

                var daysInMonth = $scope.datetime.daysInMonth()
                $scope.monthDays = []
                for(var i=0; i<daysInMonth; ++i) {
                    $scope.monthDays[i] = i
                }

                $scope.activeMonthDay = day
            }

            $scope.updateScope()

            $scope.check = function() {
                console.log($scope.datetime)
            }
        }
    }
})
