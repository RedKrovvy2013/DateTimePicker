var angular = require('angular')
var moment = require('moment')

require('./datePicker.js')
require('./timePicker.js')

angular.module('app').directive('dateTimePicker', function() {
    return {
        restrict: 'E',
        transclude: true,
        require: 'ngModel',
        template: require('./dateTimePicker.html'),
        scope: { },
        link: {
            pre: function($scope, elem, attrs, ngModelCtrl) {

                ngModelCtrl.$formatters.push(function(modelValue) {
                    console.log("formatters")
                    if(!modelValue) {
                        $scope.requestedDate = null
                        $scope.requestedTime = null
                    } else {
                        $scope.requestedDate = modelValue
                        $scope.requestedTime = modelValue
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

            },
            post: function($scope, elem, attrs, ctrl) { },
        }
    }
})
