var angular = require('angular')
var s = require("underscore.string")

angular.module('app').directive('hourFormatter', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attrs, ngModelCtrl) {

            angular.element(elem).click(function() {
                elem.select()
            })

            ngModelCtrl.$formatters.push(function(modelValue) {
                var numStr = modelValue.toString()
                if(numStr.length===1)
                    numStr = s.insert(numStr, 0, '0')
                return numStr
            })
            ngModelCtrl.$render = function() {
                elem.val(ngModelCtrl.$viewValue)
            }

            $scope.$watch("humanHour", function(newValue, oldValue) {
                if(typeof newValue === "string") {
                    var numStr = newValue.replace(/[^0-9]/g, "")
                    if(numStr==="")
                        numStr = "0"
                    var num = parseInt(numStr)
                    if(num > 12)
                        num = 12
                    if(num < 1)
                        num = 1
                    numStr = num.toString()
                    if(numStr.length===1)
                        numStr = s.insert(numStr, 0, '0')
                    elem.val(numStr)
                    ngModelCtrl.$setViewValue(num)
                }
            })
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue
            })
        }
    }
})
