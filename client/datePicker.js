var angular = require('angular')

angular.module('app').directive('datePicker', function() {
    return {
        restrict: 'E',
        template: require('./datePicker.html'),
        link: function($scope, elem, attrs, ctrl) {

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

                $scope.datetime.date(day+1)

                var daysInMonth = $scope.datetime.daysInMonth()
                $scope.monthDays = []
                for(var i=0; i<daysInMonth; ++i) {
                    $scope.monthDays[i] = i
                }

                $scope.activeMonthDay = day
            }

            $scope.updateScope()

        }
    }
})
