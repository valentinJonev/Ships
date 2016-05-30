var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Models;
        (function (Models) {
            var Misc;
            (function (Misc) {
                'use strict';
                var ErrorModel = (function () {
                    function ErrorModel(message, errorList) {
                        this.message = message;
                        this.errorList = errorList;
                    }
                    return ErrorModel;
                })();
                Misc.ErrorModel = ErrorModel;
            })(Misc = Models.Misc || (Models.Misc = {}));
        })(Models = Web.Models || (Web.Models = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
