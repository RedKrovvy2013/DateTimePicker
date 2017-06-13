var angular = require('angular')
var moment = require('moment-timezone')

require('./dialogService')

angular.module('app').directive('timePicker', function(dialogService) {
    return {
        restrict: 'E',
        require: '^dateTimePicker',
        template: require('./timePicker.html'),
        link: {
            pre: function($scope, elem, attrs, dtCtrl) {

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

                        elem.find(".selector-container h3")
                            .removeClass("unselected")
                            .text(dtCtrl.requestedTime.format("h:mm A"))
                    }
                    $scope.doHours()
                }, true)

                elem.find(".selector-container h3")
                    .addClass("unselected")
                    .text("Select time")

                $scope.$on("dateSelected", function() {
                    $scope.formattedDate = dtCtrl.requestedDate.format("MMMM D, YYYY")
                    if(!$scope.requestedTime) {
                        $scope.showAM()
                    } else {
                        $scope.requestedTime.year(dtCtrl.requestedDate.year())
                        $scope.requestedTime.dayOfYear(dtCtrl.requestedDate.dayOfYear())
                        if(!isDuringOpenHours($scope.requestedTime))
                            dtCtrl.updateTime(null)
                        //only update view once $scope.requestedTime
                        //is set on same year/day as dtCtrl.requestedDate,
                        //so that 'active' can be determined
                        if($scope.requestedTime &&
                           $scope.requestedTime.hour() < 12) //AM
                            $scope.showAM()
                        else
                            $scope.showPM()
                    }
                    $scope.$digest()
                })

                dialogService.setUp(elem, handleClose)

                function handleClose() {
                    if($scope.requestedTime)
                        dtCtrl.updateTime($scope.requestedTime)
                }

                $scope.doHours = function() {
                    if($scope.isAM) {
                        $scope.movingTime
                            = moment(dtCtrl.requestedDate).hour(0).minute(0)
                    } else {
                        $scope.movingTime
                            = moment(dtCtrl.requestedDate).hour(12).minute(0)
                    }
                    $scope.hours = []
                    for(var i=0; i<12; ++i) {
                        var hour = []
                        for(var j=0; j<4; ++j) {
                            hour.push({
                                time: moment($scope.movingTime),
                                formattedTime: $scope.movingTime.format("hh:mm A"),
                                selectable: isDuringOpenHours($scope.movingTime),
                                active: (function() {
                                    if(!$scope.requestedTime) {
                                        return false
                                    } else {
                                        return $scope.movingTime.isSame($scope.requestedTime)
                                               && isDuringOpenHours($scope.movingTime)
                                    }
                                })()
                            })
                            $scope.movingTime.add(15, 'm')
                        }
                        $scope.hours.push(hour)
                    }
                }

                $scope.selectTime = function(time, selectable) {
                    if(selectable) {
                        $scope.requestedTime = time
                        $scope.doHours()
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

                function isDuringOpenHours(time) {
                    if( time.day() === 0 ||
                        time.day() === 6 ) { //weekend
                            if(time.hour() >= 10 &&
                               time.hour() < 16)
                                  return true
                            else
                                  return false
                    } else { //weekday
                            if(time.hour() >= 7 &&
                               time.hour() < 20)
                                  return true
                            else
                                  return false
                    }
                }

            },
            post: function() {}
        }
    }
})
