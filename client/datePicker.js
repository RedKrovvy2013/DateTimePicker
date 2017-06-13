var angular = require('angular')
var moment = require('moment-timezone')

require('./dialogService')

angular.module('app').directive('datePicker', function(dialogService, $parse) {
    return {
        restrict: 'E',
        template: require('./datePicker.html'),
        require: "^dateTimePicker",
        scope: {
            sbBeforeRenderDateItem: "&?"
        },
        link: function($scope, elem, attrs, dtCtrl) {

            dialogService.setUp(elem)

            $scope.dtCtrl = dtCtrl
            $scope.$watch("dtCtrl.requestedDate", function(newVal, oldVal){

                $scope.disabled = false

                if(dtCtrl.requestedDate===null) {

                    $scope.movingDate = moment().tz(dtCtrl.sbTimeZone).date(1)

                    elem.find(".selector-container h3")
                        .addClass("unselected")
                        .text("Select date")
                } else {

                    if(typeof dtCtrl.requestedDate.disabled !== "undefined")
                        $scope.disabled = dtCtrl.requestedDate.disabled

                    $scope.movingDate = moment(dtCtrl.requestedDate).date(1)

                    if(!$scope.disabled) {
                        elem.find(".selector-container h3")
                            .removeClass("unselected")
                            .text(dtCtrl.requestedDate.format("dddd, MMMM Do, YYYY"))
                    } else {
                        elem.find(".selector-container h3")
                            .addClass("unselected")
                            .text("Select date")
                    }
                }

                $scope.updateScope()
            }, true)
               //time zone change leads to sub-property changing,
               //so must do $watch will full comparison to see change and update

            $scope.updateScope = function() {
                $scope.year = $scope.movingDate.format('YYYY')
                $scope.month = $scope.movingDate.format('MMMM')
                $scope.doWeeks()
            }

            $scope.selectDate = function(date) {
                if(!isDateBeforeToday(date) &&
                   date.month()===$scope.movingDate.month()) {

                        if(typeof $scope.sbBeforeRenderDateItem !== "undefined") {
                            $scope.sbBeforeRenderDateItem({
                                requestedDate: date})
                            //will add disabled prop to date..
                        }

                        dtCtrl.updateDate(date)
                        //updates dtCtrl.requestedDate,
                        //which fires $watch and evals disabled,
                        //and updates view
                }
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
                var currentMonth = $scope.movingDate.month()
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
                                if(!dtCtrl.requestedDate || $scope.disabled) {
                                    return false
                                } else {
                                    return dtCtrl.requestedDate.year() === date.year() &&
                                           dtCtrl.requestedDate.dayOfYear() === date.dayOfYear()
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
                if(date.year() < moment().tz(dtCtrl.sbTimeZone).year())
                    return true
                else if(date.year() > moment().tz(dtCtrl.sbTimeZone).year())
                    return false
                else  //years are same, so compare days of year
                    return date.dayOfYear() < moment().tz(dtCtrl.sbTimeZone).dayOfYear()
            }

            $scope.check = function() {
                console.log($scope.requestedDate)
            }

        }
    }
})
