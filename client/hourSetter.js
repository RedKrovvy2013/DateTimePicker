var angular = require('angular')

require('./hourFormatter')

angular.module('app').directive('hourSetter', function() {
    return {
        restrict: 'E',
        template: '<input type="text" ng-model="humanHour" hour-formatter />',
        scope: {
            amPmObj: '<',
            hour: '='
        },
        link: {
            pre: function($scope, elem, attrs, ctrl) {

                if($scope.hour===0) {
                    $scope.humanHour = 12
                } else if($scope.hour > 12) {
                    $scope.humanHour = $scope.hour - 12
                } else {
                    $scope.humanHour = $scope.hour
                }

                $scope.$watch("humanHour", function() {
                    if($scope.amPmObj.isAm) {
                        if($scope.humanHour===12)
                            $scope.hour = 0
                        else
                            $scope.hour = $scope.humanHour
                    } else { //isPm
                        if($scope.humanHour===12)
                            $scope.hour = 12
                        else
                            $scope.hour = $scope.humanHour + 12
                    }
                })
            },
            post: function(){}

        }
    }
})
