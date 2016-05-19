/// <reference path="_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        'use strict';
        var RootController = (function () {
            function RootController($rootScope, $state, $uibModal, authService, shipsServiceUrls, shipsWebPaths, shipsViewPaths) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.$uibModal = $uibModal;
                this.authService = authService;
                this.shipsServiceUrls = shipsServiceUrls;
                this.shipsWebPaths = shipsWebPaths;
                this.shipsViewPaths = shipsViewPaths;
                this.redirectedToLogin = false;
                this.onNewUrlState = function (e, toState, toParams, fromState, fromParams) {
                    if (!_this.authService.authentication.isAuth
                        && !_this.redirectedToLogin
                        && toState.name != _this.shipsWebPaths.accountLogin.state
                        && toState.name != _this.shipsWebPaths.accountRegister.state) {
                        e.preventDefault();
                        _this.redirectToLogin();
                    }
                    else {
                        _this.showLogout = true;
                    }
                };
                $rootScope.controller = this;
                this.cofigureAuthService();
                this.configureUnauthenticatedRedirect($rootScope);
            }
            RootController.prototype.logOut = function () {
                this.authService.logOut();
                this.redirectToLogin();
            };
            RootController.prototype.errorMessage = function (message, time, errorList) {
                if (errorList === void 0) { errorList = null; }
                var modalInstance = this.$uibModal.open({
                    animation: true,
                    templateUrl: this.shipsViewPaths.error,
                    controller: 'errorController',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return message;
                        },
                        time: function () {
                            return time;
                        },
                        errorList: function () {
                            return errorList ? errorList : [];
                        }
                    }
                });
            };
            RootController.prototype.hasRemoteTokenRequestFailed = function (rejection) {
                return rejection.status === 400
                    && rejection.config.url == this.shipsServiceUrls.authenticationServiceUrl
                    && this.$state.current.name != this.shipsWebPaths.accountLogin.state;
            };
            ;
            RootController.prototype.isPasswordSending = function (rejection) {
                return rejection.config.url == this.shipsServiceUrls.authenticationServiceUrl
                    && this.$state.current.name == this.shipsWebPaths.accountLogin.state;
            };
            RootController.prototype.redirectToLogin = function () {
                var _this = this;
                this.$state.go(this.shipsWebPaths.accountLogin.state);
                this.redirectedToLogin = true;
                setTimeout(function () {
                    _this.redirectedToLogin = false;
                }, 200);
            };
            RootController.prototype.cofigureAuthService = function () {
                this.authService.fillAuthData();
            };
            RootController.prototype.configureUnauthenticatedRedirect = function ($rootScope) {
                $rootScope.$on('$stateChangeStart', this.onNewUrlState);
            };
            return RootController;
        })();
        Web.RootController = RootController;
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
