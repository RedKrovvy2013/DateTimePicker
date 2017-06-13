var angular = require('angular')
var moment = require('moment-timezone')

require('./datePicker.js')
require('./timePicker.js')

angular.module('app').directive('dateTimePicker', function() {
    return {
        restrict: 'E',
        transclude: true,
        require: ['ngModel', 'dateTimePicker'],
        template: require('./dateTimePicker.html'),
        scope: {
            sbTimeZone: "<"
        },
        controller: function($scope) {

            this.sbTimeZone = $scope.sbTimeZone
            // need to have sub-dirs access via this ctrl as opposed to
            // via shared scope, because sub-dirs scope must be transclusion scope
            // to accept optional beforeRender function

            this.requestedDate = null
            this.requestedTime = null

            this.updateDate = function(date) {
                this.requestedDate = moment(date)
                if(typeof date.disabled !== "undefined")
                    this.requestedDate.disabled = date.disabled
                $scope.$broadcast("dateSelected")
                $scope.updateNgModel()
            }

            this.updateTime = function(time) {
                                                //can be null, if date changed
                                               //and prev selected time is now
                                               //a closed time
                if(time)
                    this.requestedTime = moment(time)
                else
                    this.requestedTime = null
                $scope.updateNgModel()
            }

        },
        link: {
            pre: function($scope, elem, attrs, ctrls) {

                var ngModelCtrl = ctrls[0]
                var dtCtrl = ctrls[1]

                ngModelCtrl.$formatters.push(function(modelValue) {
                    if(!modelValue) {
                        dtCtrl.requestedDate = null
                        dtCtrl.requestedTime = null
                    } else {
                        dtCtrl.requestedDate = moment(modelValue)
                        dtCtrl.requestedTime = moment(modelValue)
                    }
                })

                $scope.updateNgModel = function() {
                    //TODO: add check for disabled requested time
                    if(!dtCtrl.requestedDate || !dtCtrl.requestedTime) {
                        ngModelCtrl.$setViewValue(null)
                        return
                    }

                    if(typeof dtCtrl.requestedDate.disabled !== "undefined" &&
                       dtCtrl.requestedDate.disabled === true) {
                           ngModelCtrl.$setViewValue(null)
                           return
                       }

                    var newDatetime = moment(dtCtrl.requestedDate)
                    newDatetime.hour(dtCtrl.requestedTime.hour())
                    newDatetime.minute(dtCtrl.requestedTime.minute())
                    ngModelCtrl.$setViewValue(newDatetime)
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
                    if(dtCtrl.requestedDate) {
                        updateMomentToTZ(dtCtrl.requestedDate, $scope.sbTimeZone)
                        if(dtCtrl.requestedTime) {
                            updateMomentToTZ(dtCtrl.requestedTime, $scope.sbTimeZone)
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
