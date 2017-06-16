var angular = require('angular')

angular.module('app').service('dialogService', function($document) {

    this.setUp = function(elem, onClose) {

        elem.find(".selector-container").click(function(e) {
            e.stopPropagation()
            $document.find(".dialog").addClass('hidden')
            $document.find(".fullscreen").addClass('hidden')
            $document.find(".selector").removeClass('active')
            //above stops case of opening both dialogs at once
            if(!elem.find(".selector-container").hasClass("disabled")) {
                elem.find(".dialog").removeClass('hidden')
                elem.find(".fullscreen").removeClass('hidden')
                elem.find(".selector").addClass('active')
            }
        })

        elem.find(".fullscreen").click(function() {
            elem.find(".dialog").addClass('hidden')
            elem.find(".fullscreen").addClass('hidden')
            elem.find(".selector").removeClass('active')
        })
    }

})
