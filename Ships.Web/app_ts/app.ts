/// <reference path="_all.ts" />

module Ships.Web {
    'use strict';

    import Configurations = Ships.Web.Configurations;
    import Constants = Ships.Web.Constants;
    import Controllers = Ships.Web.Controllers;
    import Directives = Ships.Web.Directives;
    import Filters = Ships.Web.Filters;
    import Services = Ships.Web.Services;

    var app: angular.IModule = angular.module('ships-web',
        ['ui.router', 'LocalStorageModule', 'angular-loading-bar', 'ships-web-service-url', 'ui.bootstrap', 'ng-file-model', 'SignalR'])
        //constants
        .constant('shipsWebPaths', new Constants.ShipsWebPaths())
        .constant('shipsViewPaths', new Constants.ShipsViewPaths())
        .constant('shipsSettings', new Constants.ShipsSettings())
        //directives
        .directive('modal', (shipsViewPaths: Constants.ShipsViewPaths) => new Directives.ModalDirective(shipsViewPaths))
        //filters
        .filter('stringFormat', Filters.stringFormat)
        //services
        .service('authService', Services.AuthService)
        .service('hubService', Services.HubService)
        //controllers
        .controller("errorController", Controllers.ErrorController)
        .controller("homeController", Controllers.HomeController)
        .controller("invitationConfirmController", Controllers.InvitationConfirmController)
        .controller("gameCreateController", Controllers.GameCreateController)
        .controller("gameController", Controllers.GameController)
        .controller("indexController", Controllers.IndexController)
        .controller("loginController", Controllers.Account.LoginController)
        .controller("account.registerController", Controllers.Account.RegisterController)
        //configuration
        .config(['cfpLoadingBarProvider', Configurations.configureLoadingBar])
        .config(['$httpProvider', Configurations.confugreInterceptoprs])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'shipsWebPaths', 'shipsViewPaths', 'shipsServiceUrls', Configurations.configureRouting])
        .config(['localStorageServiceProvider', Configurations.configureLocalStorage])
        //custom initialization
        .run(($rootScope: IRootScope, $state: angular.ui.IStateService, $uibModal: angular.ui.bootstrap.IModalService,
                authService: Services.IAuthService, shipsServiceUrls: Constants.ShipsServiceUrls, shipsWebPaths: Constants.ShipsWebPaths,
                shipsViewPaths: Constants.ShipsViewPaths) =>
            initialize($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths));
    
    function initialize($rootScope: IRootScope, $state: angular.ui.IStateService, $uibModal: angular.ui.bootstrap.IModalService, authService: Services.IAuthService,
        shipsServiceUrls: Constants.ShipsServiceUrls, shipsWebPaths: Constants.ShipsWebPaths, shipsViewPaths: Constants.ShipsViewPaths) {
        $rootScope.controller = new RootController($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths);
    }
}