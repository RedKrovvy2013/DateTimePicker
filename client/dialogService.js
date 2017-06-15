var angular = require('angular')

angular.module('app').service('dialogService', function() {

    this.setUp = function(elem, onClose) {

        elem.find(".selector-container").click(function(e) {
            console.log('selector clicked')
            e.stopPropagation()
            if(!elem.find(".selector-container").hasClass("disabled")) {
                elem.find(".dialog").removeClass('hidden')
                elem.find(".fullscreen").removeClass('hidden')
                elem.find(".selector").addClass('active')
            }
        })

        elem.find(".fullscreen").click(function() {
            console.log('fullscreen click')
            elem.find(".dialog").addClass('hidden')
            elem.find(".fullscreen").addClass('hidden')
            elem.find(".selector").removeClass('active')
        })
    }

})
