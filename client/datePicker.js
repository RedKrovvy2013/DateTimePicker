var angular = require('angular')
var moment = require('moment')

require('./dialogService')

angular.module('app').directive('datePicker', function(dialogService) {
    return {
        restrict: 'E',
        require: '^dateTimePicker',
        template: require('./datePicker.html'),
        link: function($scope, elem, attrs, dtCtrl) {

            $scope.requestedDate = dtCtrl.order.requestedDateTime

            dialogService.setUp(elem, handleClose)

            function handleClose() {
                if($scope.requestedDate) {
                    dtCtrl.updateDate($scope.requestedDate)
                    elem.find(".selector-container h3")
                        .removeClass("unselected")
                        .text($scope.requestedDate.format("dddd, MMMM Do, YYYY"))
                } else {
                    elem.find(".selector-container h3")
                        .addClass("unselected")
                        .text("Select date")
                }
            }

            if($scope.requestedDate)
                $scope.movingDate = moment($scope.requestedDate).date(1)
            else
                $scope.movingDate = moment().date(1)

            $scope.updateScope = function() {
                $scope.year = $scope.movingDate.format('YYYY')
                $scope.month = $scope.movingDate.format('MMMM')
                $scope.doWeeks()
            }

            $scope.selectDate = function(date) {
                if(!isDateBeforeToday(date) &&
                   date.month()===$scope.movingDate.month())
                        $scope.requestedDate = moment(date)
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
                            active: (function() {
                                if(!$scope.requestedDate) {
                                    return false
                                } else {
                                    return $scope.requestedDate.year() === date.year() &&
                                           $scope.requestedDate.dayOfYear() === date.dayOfYear()
                                }
                            })(),
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
