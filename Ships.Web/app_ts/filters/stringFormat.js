var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Filters;
        (function (Filters) {
            'use strict';
            //TODO: refactor
            function stringFormat() {
                var s = arguments[0];
                for (var i = 0; i < arguments.length - 1; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    s = s.replace(reg, arguments[i + 1]);
                }
                return s;
            }
            Filters.stringFormat = stringFormat;
            ;
        })(Filters = Web.Filters || (Web.Filters = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
