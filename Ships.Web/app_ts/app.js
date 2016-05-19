/// <reference path="_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        'use strict';
        var Configurations = Ships.Web.Configurations;
        var Constants = Ships.Web.Constants;
        var Controllers = Ships.Web.Controllers;
        var Directives = Ships.Web.Directives;
        var Filters = Ships.Web.Filters;
        var Services = Ships.Web.Services;
        var app = angular.module('ships-web', ['ui.router', 'LocalStorageModule', 'angular-loading-bar', 'ships-web-service-url', 'ui.bootstrap', 'ng-file-model', 'SignalR'])
            .constant('shipsWebPaths', new Constants.ShipsWebPaths())
            .constant('shipsViewPaths', new Constants.ShipsViewPaths())
            .constant('shipsSettings', new Constants.ShipsSettings())
            .directive('modal', function (shipsViewPaths) { return new Directives.ModalDirective(shipsViewPaths); })
            .filter('stringFormat', Filters.stringFormat)
            .service('authService', Services.AuthService)
            .service('hubService', Services.HubService)
            .controller("errorController", Controllers.ErrorController)
            .controller("homeController", Controllers.HomeController)
            .controller("invitationConfirmController", Controllers.InvitationConfirmController)
            .controller("gameCreateController", Controllers.GameCreateController)
            .controller("gameController", Controllers.GameController)
            .controller("indexController", Controllers.IndexController)
            .controller("loginController", Controllers.Account.LoginController)
            .controller("account.registerController", Controllers.Account.RegisterController)
            .config(['cfpLoadingBarProvider', Configurations.configureLoadingBar])
            .config(['$httpProvider', Configurations.confugreInterceptoprs])
            .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'shipsWebPaths', 'shipsViewPaths', 'shipsServiceUrls', Configurations.configureRouting])
            .config(['localStorageServiceProvider', Configurations.configureLocalStorage])
            .run(function ($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths) {
            return initialize($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths);
        });
        function initialize($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths) {
            $rootScope.controller = new Web.RootController($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths);
        }
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
