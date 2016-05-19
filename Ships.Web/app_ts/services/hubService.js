/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Services;
        (function (Services) {
            'use strict';
            var HubService = (function () {
                function HubService($state, shipsWebPaths, authService, Hub) {
                    var _this = this;
                    this.$state = $state;
                    this.shipsWebPaths = shipsWebPaths;
                    this.authService = authService;
                    this.Hub = Hub;
                    this.hasConnectFailed = false;
                    this.onHubConnectSuccess = function (response) {
                        console.log('Now connected, connection ID=' + _this.hub.connection.id);
                    };
                    this.onHubConnectFail = function (promise) {
                        if (promise.context.status == 401) {
                            _this.redirectToLogin();
                        }
                        console.log('Could not connect');
                    };
                }
                HubService.prototype.startHub = function (hubName, options) {
                    var authData = this.authService.authorizationData.getData();
                    var accessToken = authData != null ? authData.access_token : null;
                    if (!options.queryParams) {
                        options.queryParams = {};
                    }
                    options.queryParams['access_token'] = "Bearer " + accessToken;
                    this.hub = new this.Hub(hubName, options);
                    this.createHub();
                    return this.hub;
                };
                HubService.prototype.createHub = function () {
                    this.hub.connect();
                    this.hub.connection.start()
                        .done(this.onHubConnectSuccess)
                        .fail(this.onHubConnectFail);
                };
                HubService.prototype.redirectToLogin = function () {
                    this.$state.go(this.shipsWebPaths.accountLogin.state);
                };
                HubService.$inject = ['$state', 'shipsWebPaths', 'authService', 'Hub'];
                return HubService;
            })();
            Services.HubService = HubService;
        })(Services = Web.Services || (Web.Services = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
