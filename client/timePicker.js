var angular = require('angular')
var moment = require('moment')

require('./dialogService')

angular.module('app').directive('timePicker', function(dialogService) {
    return {
        restrict: 'E',
        template: require('./timePicker.html'),
        link: {
            pre: function($scope, elem, attrs, ctrl) {

                $scope.$watch("requestedDate", function() {
                    if($scope.requestedDate===null)
                        elem.find(".selector-container").addClass("disabled")
                    else
                        elem.find(".selector-container").removeClass("disabled")
                })

                $scope.$watch("requestedTime", function(newVal, oldVal) {
                    if(newVal===null) {
                        elem.find(".selector-container h3")
                            .addClass("unselected")
                            .text("Select time")
                    } else {
                        elem.find(".selector-container h3")
                            .removeClass("unselected")
                            .text($scope.requestedTime.format("h:mm A"))
                    }
                    $scope.doHours()
                })

                elem.find(".selector-container h3")
                    .addClass("unselected")
                    .text("Select time")

                $scope.$on("dateSelected", function() {
                    $scope.formattedDate = $scope.requestedDate.format("MMMM D, YYYY")
                    if(!$scope.requestedTime) {
                        $scope.showAM()
                    } else {
                        $scope.requestedTime.year($scope.requestedDate.year())
                        $scope.requestedTime.dayOfYear($scope.requestedDate.dayOfYear())
                        if(!isDuringOpenHours($scope.requestedTime))
                            $scope.$emit("updateTime", null)
                        //only update view once $scope.requestedTime
                        //is set on same year/day as $scope.requestedDate,
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
                        $scope.$emit("updateTime", $scope.requestedTime)
                }

                $scope.doHours = function() {
                    if($scope.isAM) {
                        $scope.movingTime
                            = moment($scope.requestedDate).hour(0).minute(0)
                    } else {
                        $scope.movingTime
                            = moment($scope.requestedDate).hour(12).minute(0)
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
