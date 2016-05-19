/// <reference path="../_all.ts" />

module Ships.Web.Controllers {
    'use strict';

    export interface IIndexScope extends angular.IScope {
        viewModel: IIndexController;
    }

    export interface IIndexController {
        authentication: Models.Account.Authentication;
    }

    export class IndexController implements IIndexController {
        static $inject = ['$scope', '$state', 'authService', 'shipsWebPaths'];

        public authentication: Models.Account.Authentication;
        
        constructor(private $scope: IIndexScope, private $state: angular.ui.IStateService, private authService: Services.IAuthService, private shipsWebPaths: Constants.ShipsWebPaths) {
            $scope.viewModel = this;

            this.authentication = authService.authentication;
        }

        private redirectToLogin() {
            this.authService.logOut();
            this.$state.go(this.shipsWebPaths.accountLogin.state);
        }
    }
}