﻿/// <reference path="../_all.ts" />

module Ships.Web.Configurations {
    'use strict';


    export function configureRouting($stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        $locationProvider: angular.ILocationProvider,
        shipsWebPaths: Constants.ShipsWebPaths,
        shipsViewPaths: Constants.ShipsWebPaths,
        shipsServiceUrls: Constants.ShipsWebPaths) {

        $stateProvider.state(shipsWebPaths.home.state, {
            url: shipsWebPaths.home.url,
            controller: "homeController",
            templateUrl: shipsViewPaths.home
        });

        $stateProvider.state(shipsWebPaths.game.state, {
            url: shipsWebPaths.game.url,
            controller: "gameController",
            templateUrl: shipsViewPaths.game,
            params: {
                game_id: 0,
                service_url: null
            }
        });

        $stateProvider.state(shipsWebPaths.accountLogin.state, {
            url: shipsWebPaths.accountLogin.url,
            controller: "loginController",
            templateUrl: shipsViewPaths.accountLogin
        });

        $stateProvider.state(shipsWebPaths.accountRegister.state, {
            url: shipsWebPaths.accountRegister.url,
            controller: "account.registerController",
            templateUrl: shipsViewPaths.accountRegister
        });

        $urlRouterProvider.otherwise(shipsWebPaths.home.url);

        // use the HTML5 History API
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true
        });
    }
}