/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Configurations;
        (function (Configurations) {
            'use strict';
            //TODO: find interface
            function configureLoadingBar(cfpLoadingBarProvider) {
                cfpLoadingBarProvider.includeSpinner = false;
            }
            Configurations.configureLoadingBar = configureLoadingBar;
        })(Configurations = Web.Configurations || (Web.Configurations = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
