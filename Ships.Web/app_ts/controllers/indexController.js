/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Controllers;
        (function (Controllers) {
            'use strict';
            var IndexController = (function () {
                function IndexController($scope, $state, authService, shipsWebPaths) {
                    this.$scope = $scope;
                    this.$state = $state;
                    this.authService = authService;
                    this.shipsWebPaths = shipsWebPaths;
                    $scope.viewModel = this;
                    this.authentication = authService.authentication;
                }
                IndexController.prototype.redirectToLogin = function () {
                    this.authService.logOut();
                    this.$state.go(this.shipsWebPaths.accountLogin.state);
                };
                IndexController.$inject = ['$scope', '$state', 'authService', 'shipsWebPaths'];
                return IndexController;
            })();
            Controllers.IndexController = IndexController;
        })(Controllers = Web.Controllers || (Web.Controllers = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
