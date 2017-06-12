var angular = require('angular')
var moment = require('moment-timezone')

require('./datePicker.js')
require('./timePicker.js')

angular.module('app').directive('dateTimePicker', function() {
    return {
        restrict: 'E',
        transclude: true,
        require: 'ngModel',
        template: require('./dateTimePicker.html'),
        scope: {
            sbTimeZone: "<"
        },
        link: {
            pre: function($scope, elem, attrs, ngModelCtrl) {

                ngModelCtrl.$formatters.push(function(modelValue) {
                    if(!modelValue) {
                        $scope.requestedDate = null
                        $scope.requestedTime = null
                    } else {
                        $scope.requestedDate = moment(modelValue)
                        $scope.requestedTime = moment(modelValue)
                    }
                })

                $scope.$on("updateDate", function(e, date) {
                    $scope.requestedDate = date
                    $scope.$broadcast("dateSelected")
                    $scope.updateNgModel()
                })

                $scope.$on("updateTime", function(e, time) {
                                                    //can be null, if date changed
                                                   //and prev selected time is now
                                                   //a closed time
                    $scope.requestedTime = time
                    $scope.updateNgModel()
                })

                $scope.updateNgModel = function() {
                    if(!$scope.requestedDate || !$scope.requestedTime) {
                        ngModelCtrl.$setViewValue(null)
                    } else {
                        var newDatetime = moment($scope.requestedDate)
                        newDatetime.hour($scope.requestedTime.hour())
                        newDatetime.minute($scope.requestedTime.minute())
                        ngModelCtrl.$setViewValue(newDatetime)
                    }
                }

                ngModelCtrl.$parsers.push(function(viewValue) {
                    return viewValue
                })

                $scope.$watch("sbTimeZone", function() {
                    // 3 scenarios:
                        // 1: reqTime and reqDate are null, so do nothing
                        // 2: reqDate is only not null, so just update it
                        // 3: reqDate and reqTime are both not null, so update
                        //    reqDatetime which in turn updates reqDate and reqTime
                    if($scope.requestedDate) {
                        updateMomentToTZ($scope.requestedDate, $scope.sbTimeZone)
                        if($scope.requestedTime) {
                            updateMomentToTZ($scope.requestedTime, $scope.sbTimeZone)
                            $scope.updateNgModel()
                        }
                    }
                })

                function updateMomentToTZ(aMoment, tz) {
                    var oldMoment = moment(aMoment)
                    aMoment.tz(tz)
                    var amountToRegain = oldMoment._offset - aMoment._offset
                    aMoment.add(amountToRegain, 'm')
                }

            },
            post: function($scope, elem, attrs, ctrl) { },
        }
    }
})
