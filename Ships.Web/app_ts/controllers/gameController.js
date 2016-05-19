/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Controllers;
        (function (Controllers) {
            'use strict';
            var GameController = (function () {
                function GameController($scope, $http, $state, $stateParams, authService, hubService, shipsWebPaths, Hub) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$http = $http;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.authService = authService;
                    this.hubService = hubService;
                    this.shipsWebPaths = shipsWebPaths;
                    this.Hub = Hub;
                    this.MATRIX_SIZE = 10;
                    this.POSITIONS_COUNT = 17;
                    this.wasAlertShown = false;
                    this.notify = function () {
                        _this.hub.invoke('Notify', _this.gameId);
                    };
                    this.handleNotification = function (gameId, playerNames) {
                        if (gameId == _this.gameId) {
                            _this.playerNames = playerNames;
                            _this.refreshGameDetails();
                        }
                    };
                    this.onDetailsResult = function (response) {
                        _this.game = response.data;
                        _this.setBoards();
                        if (_this.game.winner_player_id != null) {
                            var playerName;
                            if (_this.game.current_side.player.id == _this.game.winner_player_id) {
                                playerName = _this.game.current_side.player.name;
                            }
                            else {
                                playerName = _this.game.other_side.player.name;
                            }
                            if (!_this.wasAlertShown) {
                                alert(playerName + " won!");
                                _this.wasAlertShown = true;
                            }
                            _this.$state.go(_this.shipsWebPaths.home.state);
                        }
                    };
                    $scope.controller = this;
                    if (this.$stateParams["game_id"] == null || this.$stateParams["service_url"] == null) {
                        $state.go(shipsWebPaths.home.state);
                    }
                    this.serviceUrl = this.$stateParams["service_url"];
                    this.gameId = this.$stateParams["game_id"];
                    this.createHub();
                    this.refreshGameDetails();
                }
                GameController.prototype.createHub = function () {
                    var _this = this;
                    this.hub = this.hubService.startHub("GameHub", {
                        rootPath: this.serviceUrl + "/signalr",
                        logging: false,
                        listeners: {
                            'handleNotification': this.handleNotification
                        },
                        methods: ['Notify', 'RegisterConnection']
                    });
                    this.hub.connection.start()
                        .then(function () {
                        _this.hub.invoke('RegisterConnection', _this.gameId);
                    });
                    this.$scope.$on('$stateChangeStart', function () {
                        _this.hub.disconnect();
                    });
                };
                GameController.prototype.shoot = function (row, col) {
                    if (this.canShoot(row, col)) {
                        this.boardOther[row][col] = -1;
                        var data = {
                            x: col,
                            y: row,
                            player_id: this.authService.authorizationData.getData().user_id
                        };
                        this.$http.post(this.serviceUrl + "/games/" + this.gameId + "/shots", data)
                            .then(this.notify);
                    }
                };
                GameController.prototype.refreshGameDetails = function () {
                    this.$http.get(this.serviceUrl + "/games/" + this.gameId, {
                        params: {
                            user_id: this.authService.authorizationData.getData().user_id
                        }
                    }).then(this.onDetailsResult);
                };
                GameController.prototype.setBoards = function () {
                    this.initBoards();
                    this.setBoardSide(this.game.current_side, this.boardCurrent);
                    this.setBoardSide(this.game.other_side, this.boardOther);
                    this.setHits();
                    this.setCurrentTurn();
                };
                GameController.prototype.setBoardSide = function (side, board) {
                    if (side.ships != null) {
                        for (var i in side.ships) {
                            var ship = side.ships[i];
                            for (var idx in ship.positions) {
                                var pos = ship.positions[idx];
                                board[pos.y][pos.x] = parseInt(i) + 1;
                            }
                        }
                    }
                    for (var i in side.shots) {
                        var shot = side.shots[i];
                        if (shot.is_hit) {
                            board[shot.y][shot.x] = -1000;
                        }
                        else {
                            board[shot.y][shot.x] = -1;
                        }
                    }
                };
                GameController.prototype.initBoards = function () {
                    this.boardCurrent = [];
                    this.boardOther = [];
                    for (var i = 0; i < this.MATRIX_SIZE; i++) {
                        this.boardCurrent[i + 0] = [];
                        this.boardOther[i + 0] = [];
                        for (var j = 0; j < this.MATRIX_SIZE; j++) {
                            this.boardCurrent[i + 0][j + 0] = 0;
                            this.boardOther[i + 0][j + 0] = 0;
                        }
                    }
                };
                GameController.prototype.setHits = function () {
                    this.hitCurrent = this.getHitsCount(this.boardCurrent);
                    this.hitOther = this.getHitsCount(this.boardOther);
                };
                GameController.prototype.getHitsCount = function (board) {
                    var count = 0;
                    for (var i = 0; i < this.MATRIX_SIZE; i++) {
                        for (var j = 0; j < this.MATRIX_SIZE; j++) {
                            if (board[i][j] < -1) {
                                count++;
                            }
                        }
                    }
                    return count;
                };
                GameController.prototype.setCurrentTurn = function () {
                    this.isCurrentTurn = this.game.next_shot_player_id == this.game.current_side.player.id;
                };
                GameController.prototype.canShoot = function (row, col) {
                    return this.boardOther[row][col] == 0 && this.isCurrentTurn;
                };
                GameController.$inject = ['$scope', '$http', '$state', '$stateParams', 'authService', 'hubService', 'shipsWebPaths', 'Hub'];
                return GameController;
            })();
            Controllers.GameController = GameController;
        })(Controllers = Web.Controllers || (Web.Controllers = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
