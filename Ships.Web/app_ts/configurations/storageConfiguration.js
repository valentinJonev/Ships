/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Configurations;
        (function (Configurations) {
            'use strict';
            function configureLocalStorage(localStorageServiceProvider) {
                localStorageServiceProvider
                    .setPrefix('ships-web')
                    .setStorageType('localStorage');
            }
            Configurations.configureLocalStorage = configureLocalStorage;
        })(Configurations = Web.Configurations || (Web.Configurations = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
