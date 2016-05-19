/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Controllers;
        (function (Controllers) {
            'use strict';
            var HomeController = (function () {
                function HomeController($rootScope, $scope, $http, $state, shipsWebPaths, shipsServiceUrls, shipsViewPaths, Hub, $uibModal, hubService, authService) {
                    var _this = this;
                    this.$rootScope = $rootScope;
                    this.$scope = $scope;
                    this.$http = $http;
                    this.$state = $state;
                    this.shipsWebPaths = shipsWebPaths;
                    this.shipsServiceUrls = shipsServiceUrls;
                    this.shipsViewPaths = shipsViewPaths;
                    this.Hub = Hub;
                    this.$uibModal = $uibModal;
                    this.hubService = hubService;
                    this.authService = authService;
                    this.hasInvitedSomeone = false;
                    this.setUsersList = function (users) {
                        var currentUserName = _this.authService.authorizationData.getData().user_name;
                        for (var i in users) {
                            if (users[i].Name == currentUserName) {
                                users[i].Id = null;
                            }
                        }
                        _this.users = users;
                        _this.$scope.$apply();
                    };
                    this.handleInvitation = function (firstPlayer, firstLocaleId) {
                        var modalInstance = _this.$uibModal.open({
                            animation: true,
                            templateUrl: _this.shipsViewPaths.invitationConfirm,
                            controller: 'invitationConfirmController',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: false,
                            resolve: {
                                name: function () {
                                    return firstPlayer.Name;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            _this.acceptInvitation(firstPlayer, firstLocaleId);
                        }, function () {
                            _this.usersHub.invoke('RejectInvitation', firstPlayer);
                        });
                    };
                    this.handleRejection = function (secondPlayer) {
                        _this.$rootScope.controller.errorMessage("Поканата към " + secondPlayer.Name + " беше отказана.", 10000);
                    };
                    this.startGame = function (gameId, otherPlayer, serviceUrl) {
                        var modalInstance = _this.$uibModal.open({
                            animation: true,
                            templateUrl: _this.shipsViewPaths.gameCreate,
                            controller: 'gameCreateController',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: false,
                            resolve: {
                                gameId: function () {
                                    return gameId;
                                },
                                serviceUrl: function () {
                                    return serviceUrl;
                                }
                            }
                        });
                    };
                    $scope.controller = this;
                    this.currentLocaleId = this.authService.authorizationData.getData().locale_id;
                    this.createUsersHub();
                }
                HomeController.prototype.createUsersHub = function () {
                    var _this = this;
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
                    this.$scope.$on('$stateChangeStart', function () {
                        _this.usersHub.disconnect();
                    });
                };
                HomeController.prototype.invite = function (userId) {
                    var _this = this;
                    if (!this.hasInvitedSomeone) {
                        this.hasInvitedSomeone = true;
                        ;
                        this.usersHub.invoke('InvitePlayer', userId, this.currentLocaleId);
                        setTimeout(function () {
                            _this.hasInvitedSomeone = false;
                        }, 3000);
                    }
                };
                HomeController.prototype.acceptInvitation = function (otherPlayer, firstLocaleId) {
                    var _this = this;
                    this.createGame(otherPlayer.Id, this.authService.authorizationData.getData().user_id)
                        .then(function (result) {
                        var gameId = result.data;
                        _this.usersHub.invoke('AcceptInvitation', otherPlayer, gameId, firstLocaleId, _this.currentLocaleId);
                    });
                };
                HomeController.prototype.createGame = function (firstPlayerId, secondPlayerId) {
                    var model = {
                        first_player_id: firstPlayerId,
                        second_player_id: secondPlayerId
                    };
                    var url = this.getUrlFromCsList(this.authService.authorizationData.getData().locale_urls);
                    return this.$http.post(url + "/games", model);
                };
                HomeController.prototype.getUrlFromCsList = function (csUrls) {
                    var urls = csUrls.split(',');
                    var randomIdx = this.getRandomIntBetween(0, urls.length - 1);
                    return urls[randomIdx];
                };
                HomeController.prototype.getRandomIntBetween = function (min, max) {
                    var randValue = (Math.random() * (max - min + 1)) + "";
                    return parseInt(randValue, 10) + min;
                };
                HomeController.$inject = ['$rootScope', '$scope', '$http', '$state', 'shipsWebPaths', 'shipsServiceUrls', 'shipsViewPaths', 'Hub', '$uibModal', 'hubService', 'authService'];
                return HomeController;
            })();
            Controllers.HomeController = HomeController;
        })(Controllers = Web.Controllers || (Web.Controllers = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
