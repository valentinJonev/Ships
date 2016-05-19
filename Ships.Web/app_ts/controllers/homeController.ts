/// <reference path="../_all.ts" />

module Ships.Web.Controllers {
    'use strict';

    export interface IHomeScope extends angular.IScope {
        controller: IHomeController;
    }

    export interface IHomeController {
        shipsWebPaths: Constants.ShipsWebPaths;
        users: Models.Account.UserListModel[];
        hasInvitedSomeone: boolean;
    }

    export class HomeController implements IHomeController {
        static $inject = ['$rootScope', '$scope', '$http', '$state', 'shipsWebPaths', 'shipsServiceUrls', 'shipsViewPaths', 'Hub', '$uibModal', 'hubService', 'authService'];
        
        private usersHub: ngSignalr.Hub;
        private currentLocaleId: number;

        public hasInvitedSomeone: boolean = false;
        public users: Models.Account.UserListModel[];

        constructor(private $rootScope: IRootScope, private $scope: IHomeScope,
            private $http: angular.IHttpService, private $state: angular.ui.IStateService,
            public shipsWebPaths: Constants.ShipsWebPaths, private shipsServiceUrls: Constants.ShipsServiceUrls, private shipsViewPaths: Constants.ShipsViewPaths,
            private Hub: ngSignalr.HubFactory, private $uibModal: angular.ui.bootstrap.IModalService,
            private hubService: Services.HubService, private authService: Services.IAuthService) {
            $scope.controller = this;

            this.currentLocaleId = this.authService.authorizationData.getData().locale_id;
            this.createUsersHub();
        }

        private createUsersHub(): void {
            this.usersHub = this.hubService.startHub("UsersListHub", {
                rootPath: this.shipsServiceUrls.authenticationServiceUrl + "/signalr",
                logging: false,
                listeners: {
                    'setUsersList': this.setUsersList,
                    'handleInvitation': this.handleInvitation,
                    'handleRejection': this.handleRejection,
                    'startGame': this.startGame
                },
                methods: ['InvitePlayer', 'AcceptInvitation', 'RejectInvitation']
            });

            this.$scope.$on('$stateChangeStart', () => {
                this.usersHub.disconnect();
            });
        }

        private setUsersList = (users: Models.Account.UserListModel[]) => {
            var currentUserName: string = this.authService.authorizationData.getData().user_name;
            for (var i in users) {
                if (users[i].Name == currentUserName) {
                    users[i].Id = null;
                }
            }

            this.users = users;
            this.$scope.$apply();
        }

        private invite(userId: string) {
            if (!this.hasInvitedSomeone) {
                this.hasInvitedSomeone = true;;
                this.usersHub.invoke('InvitePlayer', userId, this.currentLocaleId);

                setTimeout(() => {
                    this.hasInvitedSomeone = false;
                }, 3000);
            }
        }

        private handleInvitation = (firstPlayer: Models.Account.UserListModel, firstLocaleId: number) => {
            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: this.shipsViewPaths.invitationConfirm,
                controller: 'invitationConfirmController',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    name: function () {
                        return firstPlayer.Name
                    }
                }
            });

            modalInstance.result.then(() => {
                this.acceptInvitation(firstPlayer, firstLocaleId);
            }, () => {
                this.usersHub.invoke('RejectInvitation', firstPlayer);
            });
        }

        private handleRejection = (secondPlayer: Models.Account.UserListModel) => {
            this.$rootScope.controller.errorMessage("Поканата към " + secondPlayer.Name + " беше отказана.", 10000);
        }

        private acceptInvitation(otherPlayer: Models.Account.UserListModel, firstLocaleId: number) {
            this.createGame(otherPlayer.Id, this.authService.authorizationData.getData().user_id)
                .then((result: angular.IHttpPromiseCallbackArg<number>) => {
                    var gameId: number = result.data;

                    this.usersHub.invoke('AcceptInvitation', otherPlayer, gameId, firstLocaleId, this.currentLocaleId);
                });
        }

        private startGame = (gameId: number, otherPlayer: Models.Account.UserListModel, serviceUrl : string) => {
            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: this.shipsViewPaths.gameCreate,
                controller: 'gameCreateController',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    gameId: function (): number {
                        return gameId;
                    },
                    serviceUrl: function (): string {
                        return serviceUrl;
                    }
                }
            });
        }

        private createGame(firstPlayerId: string, secondPlayerId: string): angular.IHttpPromise<number> {
            var model: Models.Game.CreateModel = {
                first_player_id: firstPlayerId,
                second_player_id: secondPlayerId
            };

            var url: string = this.getUrlFromCsList(this.authService.authorizationData.getData().locale_urls);
            return this.$http.post<number>(url + "/games", model);
        }

        private getUrlFromCsList(csUrls: string): string {
            var urls: string[] = csUrls.split(',');
            var randomIdx: number = this.getRandomIntBetween(0, urls.length - 1);

            return urls[randomIdx];
        }

        private getRandomIntBetween(min: number, max: number): number {
            var randValue: string = (Math.random() * (max - min + 1)) + "";
            return parseInt(randValue, 10) + min;
        }
    }
}