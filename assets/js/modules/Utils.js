(function (xtens, utils) {
    /**
     * @description convert a string replacing underscore with whitespaces and Capitalizing only the first letter
     */
    utils.replaceUnderscoreAndCapitalize = function (str) {
        return str.replace(/_/g, " ").replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };

    utils.hideElement = function (tag) {
        if ($(tag).is(':visible')) {
            $(tag).attr("style", "display: none !important");
        }
    };

    utils.showElement = function (tag) {
        if (!$(tag).is(':visible')) {
            $(tag).attr("style", "display: block !important");
        }
    };

    utils.isElementInView = function (element, fullyInView) {
        var pageTop = $(window).scrollTop();
        var pageBottom = pageTop + $(window).height();
        var elementTop = $(element).offset().top;
        var elementBottom = elementTop + $(element).height();

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    };

    utils.isExactMatch = function (str, match) {
        return new RegExp('\\b' + match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b').test(str);
    };

    /**
     * @description a set of utility functions for Date management
     */
    utils.date = {

        /**
         * @description convert European Date Format string ("MM/DD/YYYY") to the corresponding Date
         * @return {Date} the corresponding date
         */
        eurostring2IsoDate: function (val) {
            var dateArray = val.split("/");
            return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
        },

        zuluDatetime2eurostring: function (val) {
            return val.slice(0, val.indexOf("T")).split("-").reverse().join("/");
        }

    };
}(xtens, xtens.module("utils")));
