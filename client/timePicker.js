var angular = require('angular')
var moment = require('moment-timezone')
var _ = require('lodash')

require('./dialogService')

angular.module('app').directive('timePicker', function(dialogService) {
    return {
        restrict: 'E',
        require: '^dateTimePicker',
        template: require('./timePicker.html'),
        scope: {
            sbBeforeRenderTimeItem: '&?'
        },
        link: {
            pre: function($scope, elem, attrs, dtCtrl) {

                dialogService.setUp(elem)

                $scope.dtCtrl = dtCtrl
                $scope.$watch("dtCtrl.requestedDate", function() {
                    if(dtCtrl.requestedDate===null)
                        elem.find(".selector-container").addClass("disabled")
                    else
                        elem.find(".selector-container").removeClass("disabled")
                })

                $scope.$watch("dtCtrl.requestedTime", function(newVal, oldVal) {

                    if(newVal===null) {
                        $scope.requestedTime = null

                        elem.find(".selector-container h3")
                            .addClass("unselected")
                            .text("Select time")
                    } else {
                        $scope.requestedTime = moment(dtCtrl.requestedTime)
                        $scope.requestedTime.disabled = false

                        elem.find(".selector-container h3")
                            .removeClass("unselected")
                            .text(dtCtrl.requestedTime.format("h:mm A"))
                    }
                    $scope.doHours()
                }, true)

                $scope.$on("dateSelected", function() {
                    $scope.formattedDate = dtCtrl.requestedDate.format("MMMM D, YYYY")
                    if(!$scope.requestedTime) {
                        $scope.showAM()
                    } else {
                        $scope.requestedTime.year(dtCtrl.requestedDate.year())
                        $scope.requestedTime.dayOfYear(dtCtrl.requestedDate.dayOfYear())

                        if(typeof $scope.sbBeforeRenderTimeItem !== "undefined")
                            $scope.sbBeforeRenderTimeItem(
                                {timeItem: $scope.requestedTime})

                        if($scope.requestedTime.disabled)
                            dtCtrl.updateTime(null)
                        //only update view once $scope.requestedTime
                        //is set on same year/day as dtCtrl.requestedDate,
                        //so that 'active' can be determined
                        if($scope.requestedTime.hour() < 12) //AM
                            $scope.showAM()
                        else
                            $scope.showPM()
                    }
                })

                $scope.doHours = function() {
                    if($scope.isAM) {
                        $scope.movingTime
                            = moment(dtCtrl.requestedDate).hour(0).minute(0)
                    } else {
                        $scope.movingTime
                            = moment(dtCtrl.requestedDate).hour(12).minute(0)
                    }
                    $scope.movingTime.disabled = false
                    $scope.hours = []
                    for(var i=0; i<12; ++i) {
                        var hour = []
                        for(var j=0; j<4; ++j, $scope.movingTime.add(15, 'm')) {

                            if(typeof $scope.sbBeforeRenderTimeItem !== "undefined") {
                                $scope.sbBeforeRenderTimeItem({timeItem: $scope.movingTime})
                            }

                            hour.push({
                                time: _.cloneDeep($scope.movingTime),
                                //cloneDeep() to carry over the disabled prop
                                formattedTime: $scope.movingTime.format("hh:mm A"),
                                selectable: !$scope.movingTime.disabled,
                                active: (function() {
                                    if(!$scope.requestedTime) {
                                        return false
                                    } else {
                                        return $scope.movingTime.isSame($scope.requestedTime)
                                               && !$scope.movingTime.disabled
                                    }
                                })()
                            })
                        }
                        $scope.hours.push(hour)
                    }
                }

                $scope.selectTime = function(time) {
                    if(!time.disabled) {
                        dtCtrl.updateTime(time)
                        //updates dtCtrl.requestedTime,
                        //which fires $watch and updates view
                    }
                }

                $scope.showAM = function() {
                    $scope.isAM = true
                    $scope.doHours()
                }

                $scope.showPM = function() {
                    $scope.isAM = false
                    $scope.doHours()
                }

            },
            post: function() {}
        }
    }
})
