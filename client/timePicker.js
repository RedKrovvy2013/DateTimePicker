var angular = require('angular')
var moment = require('moment')

require('./dialogService')

angular.module('app').directive('timePicker', function(dialogService) {
    return {
        restrict: 'E',
        template: require('./timePicker.html'),
        link: {
            pre: function($scope, elem, attrs, ctrl) {

                dialogService.setUp(elem)

                $scope.isAM = true

                $scope.doHours = function() {
                    if($scope.isAM)
                        $scope.movingTime = moment().hour(0).minute(0)
                    else
                        $scope.movingTime = moment().hour(12).minute(0)
                    $scope.hours = []
                    for(var i=0; i<12; ++i) {
                        var hour = []
                        for(var j=0; j<4; ++j) {
                            hour.push({
                                time: moment($scope.movingTime),
                                formattedTime: $scope.movingTime.format("hh:mm A")
                            })
                            $scope.movingTime.add(15, 'm')
                        }
                        $scope.hours.push(hour)
                    }
                }

                $scope.selectAM = function() {
                    $scope.isAM = true
                    $scope.doHours()
                }

                $scope.selectPM = function() {
                    $scope.isAM = false
                    $scope.doHours()
                }

                $scope.selectAM()

            },
            post: function() {}
        }
    }
})
