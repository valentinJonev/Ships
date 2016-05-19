/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Configurations;
        (function (Configurations) {
            'use strict';
            function confugreInterceptoprs($httpProvider) {
                $httpProvider.interceptors.push(Web.Services.AuthInterceptorService.Factory);
                $httpProvider.interceptors.push(Web.Services.ErrorInterceptorService.Factory);
            }
            Configurations.confugreInterceptoprs = confugreInterceptoprs;
        })(Configurations = Web.Configurations || (Web.Configurations = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
