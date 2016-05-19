/// <reference path="../../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Controllers;
        (function (Controllers) {
            var Account;
            (function (Account) {
                'use strict';
                var RegisterController = (function () {
                    function RegisterController($scope, $state, authService, shipsWebPaths) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$state = $state;
                        this.authService = authService;
                        this.shipsWebPaths = shipsWebPaths;
                        this.onRegisterSucccess = function (response) {
                            _this.$state.go(_this.shipsWebPaths.accountLogin.state);
                        };
                        this.onRegisterFail = function (response) {
                            if (response.data) {
                                _this.errorMessage = response.data.message;
                            }
                            _this.model.password = '';
                            _this.repeatPassword = '';
                        };
                        $scope.controller = this;
                        this.errorMessage = "";
                        this.model = {
                            username: "",
                            password: ""
                        };
                    }
                    RegisterController.prototype.register = function () {
                        this.errorMessage = "";
                        if (this.$scope.registerForm.$valid) {
                            this.authService.register(this.model).then(this.onRegisterSucccess, this.onRegisterFail);
                        }
                        else {
                            this.$scope.registerForm.$submitted = true;
                        }
                    };
                    RegisterController.$inject = ['$scope', '$state', 'authService', 'shipsWebPaths'];
                    return RegisterController;
                })();
                Account.RegisterController = RegisterController;
            })(Account = Controllers.Account || (Controllers.Account = {}));
        })(Controllers = Web.Controllers || (Web.Controllers = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
