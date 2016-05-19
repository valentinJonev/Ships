/// <reference path="../_all.ts" />
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Controllers;
        (function (Controllers) {
            'use strict';
            var GameCreateController = (function () {
                function GameCreateController($scope, $http, $state, $uibModalInstance, authService, shipsWebPaths, gameId, serviceUrl) {
                    var _this = this;
                    this.$http = $http;
                    this.$state = $state;
                    this.$uibModalInstance = $uibModalInstance;
                    this.authService = authService;
                    this.shipsWebPaths = shipsWebPaths;
                    this.gameId = gameId;
                    this.serviceUrl = serviceUrl;
                    this.MIN_SHIP_LENGTH = 2;
                    this.MAX_SHIP_LENGTH = 4;
                    this.MATRIX_SIZE = 10;
                    this.POSITIONS_COUNT = 17;
                    this.shipsNextIdx = 1;
                    this.onCreateComplete = function () {
                        _this.$state.go(_this.shipsWebPaths.game.state, {
                            game_id: _this.gameId,
                            service_url: _this.serviceUrl
                        });
                    };
                    $scope.controller = this;
                    this.initBoard();
                    this.selectedCells = 0;
                    this.canAdd = false;
                    this.canComplete = false;
                    this.ships = [];
                    this.reset();
                }
                GameCreateController.prototype.addPosition = function (row, col) {
                    if (!this.canBeInShip(row, col)) {
                        return;
                    }
                    this.inProgress.positions.push({
                        x: col,
                        y: row
                    });
                    this.setBoard();
                };
                GameCreateController.prototype.removePosition = function (row, col) {
                    var removeAt = this.inProgress.positions.lastIndexOf({
                        x: col,
                        y: row
                    });
                    this.inProgress.positions.splice(removeAt, 1);
                    this.setBoard();
                };
                GameCreateController.prototype.addShip = function () {
                    if (!this.canAdd) {
                        return;
                    }
                    this.ships.push(this.inProgress);
                    this.reset();
                    this.setBoard();
                };
                GameCreateController.prototype.removeShip = function (shipIdx) {
                    for (var i in this.ships) {
                        if (this.ships[i].idx == shipIdx) {
                            this.ships.splice(i, 1);
                            break;
                        }
                    }
                    this.setBoard();
                };
                GameCreateController.prototype.canBeInShip = function (row, col) {
                    if (this.inProgress.positions.length < 1) {
                        return true;
                    }
                    if (this.inProgress.positions.length >= this.MAX_SHIP_LENGTH || this.selectedCells >= this.POSITIONS_COUNT || !this.areCoordsInBounds(row, col)) {
                        return false;
                    }
                    var moreThanOne = false;
                    if (this.inProgress.positions.length > 1) {
                        moreThanOne = true;
                    }
                    if (!this.isNextToAnyPosition(row, col) || moreThanOne && !this.isInSameDimension(row, col)) {
                        return false;
                    }
                    return true;
                };
                GameCreateController.prototype.confirm = function () {
                    if (!this.canComplete) {
                        return;
                    }
                    this.addShip();
                    var model = {
                        player_id: this.authService.authorizationData.getData().user_id,
                        ships: this.ships
                    };
                    this.$http.post(this.serviceUrl + "/games/" + this.gameId + "/ships", model)
                        .then(this.onCreateComplete);
                    this.$uibModalInstance.close();
                };
                GameCreateController.prototype.reset = function () {
                    this.inProgress = {
                        idx: this.shipsNextIdx++,
                        positions: []
                    };
                    this.setBoard();
                };
                GameCreateController.prototype.initBoard = function () {
                    this.board = [];
                    for (var i = 0; i < this.MATRIX_SIZE; i++) {
                        this.board[i + 0] = [];
                        for (var j = 0; j < this.MATRIX_SIZE; j++) {
                            this.board[i + 0][j + 0] = 0;
                        }
                    }
                };
                GameCreateController.prototype.isShipValid = function () {
                    var ship = this.inProgress;
                    if (ship.positions.length < this.MIN_SHIP_LENGTH || ship.positions.length > this.MAX_SHIP_LENGTH) {
                        return false;
                    }
                    if (this.getLongestDist(ship.positions) > ship.positions.length - 1) {
                        return false;
                    }
                    var firstPos = ship.positions[0];
                    for (var i in ship.positions) {
                        if (ship.positions[i].x != firstPos.x && ship.positions[i].y != firstPos.y) {
                            return false;
                        }
                    }
                    return true;
                };
                GameCreateController.prototype.getLongestDist = function (positions) {
                    var minX = 10, minY = 10, maxX = -1, maxY = -1;
                    for (var i in positions) {
                        if (minX > positions[i].x) {
                            minX = positions[i].x;
                        }
                        if (maxX > positions[i].x) {
                            maxX = positions[i].x;
                        }
                        if (minY > positions[i].y) {
                            minY = positions[i].y;
                        }
                        if (maxY > positions[i].y) {
                            maxY = positions[i].y;
                        }
                    }
                    return (maxX - minX) + (maxY - minY);
                };
                GameCreateController.prototype.areCoordsInBounds = function (row, col) {
                    return row < this.MATRIX_SIZE
                        && row >= 0
                        && col < this.MATRIX_SIZE
                        && col >= 0;
                };
                GameCreateController.prototype.isNextToAnyPosition = function (row, col) {
                    for (var i in this.inProgress.positions) {
                        var pos = this.inProgress.positions[i];
                        if (((row - pos.y) == 1 && (col - pos.x) == 0)
                            || ((row - pos.y) == -1 && (col - pos.x) == 0)
                            || ((row - pos.y) == 0 && (col - pos.x) == 1)
                            || ((row - pos.y) == 0 && (col - pos.x) == -1)) {
                            return true;
                        }
                    }
                    return false;
                };
                GameCreateController.prototype.isInSameDimension = function (row, col) {
                    var isHorizontal = this.inProgress.positions[0].y == this.inProgress.positions[1].y;
                    if (isHorizontal) {
                        return row == this.inProgress.positions[0].y;
                    }
                    else {
                        return col == this.inProgress.positions[0].x;
                    }
                };
                GameCreateController.prototype.setBoard = function () {
                    this.initBoard();
                    for (var i in this.ships) {
                        for (var idx in this.ships[i].positions) {
                            var pos = this.ships[i].positions[idx];
                            this.board[pos.y][pos.x] = this.ships[i].idx;
                        }
                    }
                    for (var idx in this.inProgress.positions) {
                        var pos = this.inProgress.positions[idx];
                        this.board[pos.y][pos.x] = -1;
                    }
                    this.selectedCells = this.inProgress.positions.length;
                    for (var i in this.ships) {
                        this.selectedCells += this.ships[i].positions.length;
                    }
                    this.canAdd = this.isShipValid();
                    this.canComplete = this.selectedCells == this.POSITIONS_COUNT;
                };
                GameCreateController.$inject = ['$scope', '$http', '$state', '$uibModalInstance', 'authService', 'shipsWebPaths', 'gameId', 'serviceUrl'];
                return GameCreateController;
            })();
            Controllers.GameCreateController = GameCreateController;
        })(Controllers = Web.Controllers || (Web.Controllers = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
