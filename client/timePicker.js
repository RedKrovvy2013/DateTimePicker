var angular = require('angular')

require('./minuteFormatter')
require('./hourSetter')

angular.module('app').directive('timePicker', function() {
    return {
        restrict: 'E',
        template: require('./timePicker.html'),
        link: {
            pre: function($scope, elem, attrs, ctrl) {

                $scope.hour = $scope.datetime.hour()
                $scope.minute = $scope.datetime.minute()

                $scope.$watch("hour + minute", function() {
                    $scope.datetime.hour($scope.hour)
                    $scope.datetime.minute($scope.minute)
                })

                $scope.amPmObj = { isAm: ($scope.hour < 12) ? true : false }

                $scope.selectOptions = [
                    { name: "AM", isAm: true },
                    { name: "PM", isAm: false }
                ]
                if($scope.amPmObj.isAm) {
                    $scope.selected = $scope.selectOptions[0]
                } else {
                    $scope.selected = $scope.selectOptions[1]
                }
                $scope.$watch("selected", function(newVal, oldVal) {
                    if(newVal!==oldVal) {
                        $scope.amPmObj.isAm = $scope.selected.isAm
                        if($scope.amPmObj.isAm)
                            $scope.hour = $scope.hour-12
                        else  //isPm
                            $scope.hour = $scope.hour+12
                    }
                })
            },
            post: function() {}
        }
    }
})
