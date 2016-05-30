/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Controllers;
        (function (Controllers) {
            'use strict';
            var InvitationConfirmController = (function () {
                function InvitationConfirmController($scope, $uibModalInstance, name) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.name = name;
                    $scope.controller = this;
                }
                InvitationConfirmController.prototype.cancel = function () {
                    this.$uibModalInstance.dismiss('cancel');
                };
                InvitationConfirmController.prototype.confirm = function () {
                    this.$uibModalInstance.close();
                };
                ;
                InvitationConfirmController.$inject = ['$scope', '$uibModalInstance', 'name'];
                return InvitationConfirmController;
            })();
            Controllers.InvitationConfirmController = InvitationConfirmController;
        })(Controllers = Web.Controllers || (Web.Controllers = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
