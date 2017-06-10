var angular = require('angular')
var moment = require('moment')

require('./dialogService')

angular.module('app').directive('datePicker', function(dialogService) {
    return {
        restrict: 'E',
        template: require('./datePicker.html'),
        link: function($scope, elem, attrs, ctrl) {

            dialogService.setUp(elem)

            $scope.movingDate = moment($scope.datetime).date(1)

            $scope.updateScope = function() {
                $scope.year = $scope.movingDate.format('YYYY')
                $scope.month = $scope.movingDate.format('MMM')
                $scope.doWeeks()
            }

            $scope.selectDate = function(date) {
                if(!isDateBeforeToday(date) &&
                   date.month()===$scope.movingDate.month())
                        $scope.datetime = moment(date)
                $scope.updateScope()
            }

            $scope.prevMonth = function() {
                $scope.movingDate.add(-1, 'M')
                $scope.updateScope()
            }

            $scope.nextMonth = function() {
                $scope.movingDate.add(1, 'M')
                $scope.updateScope()
            }

            $scope.doWeeks = function() {
                var date = moment($scope.movingDate)
                while(date.day() !== 0)
                    date.subtract(1, 'd')
                var currentMonth = moment($scope.movingDate).month()
                var nextMonth = moment($scope.movingDate).add(1, 'M').month()
                $scope.weeks = []
                while(true) {
                    if(date.month() === nextMonth && date.day() === 0)
                        break
                    var week = []
                    for(var i=0; i<7; ++i) {
                        week.push({
                            date: moment(date),
                            dayOfMonth: date.date(),
                            active: $scope.datetime.year() === date.year() &&
                                    $scope.datetime.dayOfYear() === date.dayOfYear(),
                            inPast: isDateBeforeToday(date),
                            selectable: (function() {
                                if(isDateBeforeToday(date))
                                    return false
                                else if(date.month()===nextMonth)
                                    return false
                                else
                                    return true
                            })(),
                            notThisMonth: (function() {
                                if(date.month()!==currentMonth)
                                    return true
                                else
                                    return false
                            })()
                        })
                        date.add(1, 'd')
                    }
                    $scope.weeks.push(week)
                }
            }

            function isDateBeforeToday(date) {
                if(date.year() < moment().year())
                    return true
                else if(date.year() > moment().year())
                    return false
                else  //years are same, so compare days of year
                    return date.dayOfYear() < moment().dayOfYear()
            }

            $scope.updateScope()

        }
    }
})
