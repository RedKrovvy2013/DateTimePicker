var angular = require('angular')
var moment = require('moment-timezone')
var _ = require('lodash')

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

                if(dtCtrl.requestedDate===null) {

                    $scope.movingDate = moment().tz(dtCtrl.sbTimeZone).date(1)

                    elem.find(".selector-container h3")
                        .addClass("unselected")
                        .text("Select date")
                } else {

                    $scope.movingDate = moment(dtCtrl.requestedDate).date(1)

                    elem.find(".selector-container h3")
                        .removeClass("unselected")
                        .text(dtCtrl.requestedDate.format("dddd, MMMM Do, YYYY"))
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
                if(!date.disabled &&
                   date.month()===$scope.movingDate.month()) {
                        dtCtrl.updateDate(date)
                        //updates dtCtrl.requestedDate,
                        //which fires $watch and updates view
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
                date.disabled = false

                while(date.day() !== 0)
                    date.subtract(1, 'd')
                var currentMonth = $scope.movingDate.month()
                var nextMonth = moment($scope.movingDate).add(1, 'M').month()
                $scope.weeks = []
                while(true) {
                    if(date.month() === nextMonth && date.day() === 0)
                        break
                    var week = []
                    for(var i=0; i<7; ++i, date.add(1, 'd')) {
                        if(typeof $scope.sbBeforeRenderDateItem !== "undefined") {
                            $scope.sbBeforeRenderDateItem({dateItem: date})
                            //reassigns date.disabled
                        }
                        week.push({
                            date: _.cloneDeep(date),
                            //must cloneDeep() as opposed to moment() copy
                            //to carry over added disabled property
                            dayOfMonth: date.date(),
                            active: (function() {
                                if(!dtCtrl.requestedDate) {
                                    return false
                                } else {
                                    return dtCtrl.requestedDate.year() === date.year() &&
                                           dtCtrl.requestedDate.dayOfYear() === date.dayOfYear()
                                }
                            })(),
                            disabled: date.disabled,
                            selectable: (function() {
                                if(date.disabled)
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
                    }
                    $scope.weeks.push(week)
                }
            }

            $scope.check = function() {
                console.log($scope.requestedDate)
            }

        }
    }
})
