/// <reference path="../_all.ts" />

module Ships.Web.Controllers {
    'use strict';

    export interface IGameCreateScope extends angular.IScope {
        controller: IGameCreateController;
    }

    export interface IGameCreateController {
        POSITIONS_COUNT: number;
        board: number[][];
        selectedCells: number;
        canAdd: boolean;
        canComplete: boolean;
        ships: Models.Game.ShipModel[];
        inProgress: Models.Game.ShipModel;

        addPosition(row: number, col: number);
        removePosition(row: number, col: number);
        addShip();
        removeShip(shipIdx: number);
        confirm();
        reset();
        canBeInShip(row, col);
    }

    export class GameCreateController implements IGameCreateController {
        static $inject = ['$scope', '$http', '$state', '$uibModalInstance', 'authService', 'shipsWebPaths', 'gameId', 'serviceUrl'];

        private MIN_SHIP_LENGTH: number = 2;
        private MAX_SHIP_LENGTH: number = 4;
        private MATRIX_SIZE: number = 10;
        public POSITIONS_COUNT: number = 17;
        private shipsNextIdx = 1;

        public board: number[][];
        public selectedCells: number;
        public canAdd: boolean;
        public canComplete: boolean;
        public ships: Models.Game.ShipModel[];
        public inProgress: Models.Game.ShipModel;

        constructor($scope: IGameCreateScope, private $http: angular.IHttpService, private $state: angular.ui.IStateService,
            private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, private authService: Services.IAuthService,
            private shipsWebPaths: Constants.ShipsWebPaths, private gameId: number, private serviceUrl: string) {
            $scope.controller = this;

            this.initBoard();
            this.selectedCells = 0;
            this.canAdd = false;
            this.canComplete = false;
            this.ships = [];
            this.reset();
        }

        public addPosition(row: number, col: number) {
            if (!this.canBeInShip(row, col)) {
                return;
            }

            this.inProgress.positions.push({
                x: col,
                y: row
            });
            
            this.setBoard();
        }

        public removePosition(row: number, col: number) {
            var removeAt: number = this.inProgress.positions.lastIndexOf({
                x: col,
                y: row
            });
            
            this.inProgress.positions.splice(removeAt, 1);
            this.setBoard();
        }

        public addShip() {
            if (!this.canAdd) {
                return;
            }

            this.ships.push(this.inProgress);

            this.reset();
            this.setBoard();
        }

        public removeShip(shipIdx: number) {
            for (var i in this.ships) {
                if (this.ships[i].idx == shipIdx) {
                    this.ships.splice(i, 1);
                    break;
                }
            }

            this.setBoard();
        }

        public canBeInShip(row: number, col: number) {
            if (this.inProgress.positions.length < 1) {
                return true;
            }

            if (this.inProgress.positions.length >= this.MAX_SHIP_LENGTH || this.selectedCells >= this.POSITIONS_COUNT || !this.areCoordsInBounds(row, col)) {
                return false;
            }

            var moreThanOne: boolean = false;
            if (this.inProgress.positions.length > 1) {
                moreThanOne = true;
            }
            
            if (!this.isNextToAnyPosition(row, col) || moreThanOne && !this.isInSameDimension(row, col)) {
                return false;
            }

            return true;
        }

        public confirm() {
            if (!this.canComplete) {
                return;
            }

            this.addShip();

            var model: Models.Game.GameSetupCreateModel = {
                player_id: this.authService.authorizationData.getData().user_id,
                ships: this.ships
            };

            this.$http.post(this.serviceUrl + "/games/" + this.gameId + "/ships", model)
                .then(this.onCreateComplete);

            this.$uibModalInstance.close();
        }

        public reset() {
            this.inProgress = {
                idx: this.shipsNextIdx++,
                positions: []
            };

            this.setBoard();
        }

        private onCreateComplete = () => {
            this.$state.go(this.shipsWebPaths.game.state, {
                game_id: this.gameId,
                service_url: this.serviceUrl
            });
        }

        private initBoard() {
            this.board = [];
            for (var i = 0; i < this.MATRIX_SIZE; i++) {
                this.board[i + 0] = [];
                for (var j = 0; j < this.MATRIX_SIZE; j++) {
                    this.board[i + 0][j + 0] = 0;
                }
            }
        }

        private isShipValid(): boolean {
            var ship: Models.Game.ShipModel = this.inProgress;

            if (ship.positions.length < this.MIN_SHIP_LENGTH || ship.positions.length > this.MAX_SHIP_LENGTH) {
                return false
            }

            if (this.getLongestDist(ship.positions) > ship.positions.length - 1) {
                return false;
            }

            var firstPos: Models.Game.PositionModel = ship.positions[0];
            for (var i in ship.positions) {
                if (ship.positions[i].x != firstPos.x && ship.positions[i].y != firstPos.y) {
                    return false;
                }
            }

            return true;
        }

        private getLongestDist(positions: Models.Game.PositionModel[]) {
            var minX: number = 10, minY: number = 10, maxX: number = -1, maxY: number = -1;
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
        }

        private areCoordsInBounds(row: number, col: number): boolean {
            return row < this.MATRIX_SIZE
                && row >= 0
                && col < this.MATRIX_SIZE
                && col >= 0;
        }

        private isNextToAnyPosition(row: number, col: number): boolean {
            for (var i in this.inProgress.positions) {
                var pos: Models.Game.PositionModel = this.inProgress.positions[i];
                if (((row - pos.y) == 1 && (col - pos.x) == 0)
                    || ((row - pos.y) == -1 && (col - pos.x) == 0)
                    || ((row - pos.y) == 0 && (col - pos.x) == 1)
                    || ((row - pos.y) == 0 && (col - pos.x) == -1)) {
                    return true;
                }
            }

            return false;
        }

        private isInSameDimension(row: number, col: number): boolean {
            var isHorizontal: boolean = this.inProgress.positions[0].y == this.inProgress.positions[1].y;
            if (isHorizontal) {
                return row == this.inProgress.positions[0].y;
            }
            else {
                return col == this.inProgress.positions[0].x;
            }
        }

        private setBoard() {
            this.initBoard();

            for (var i in this.ships) {
                for (var idx in this.ships[i].positions) {
                    var pos: Models.Game.PositionModel = this.ships[i].positions[idx];
                    this.board[pos.y][pos.x] = this.ships[i].idx;
                }
            }

            for (var idx in this.inProgress.positions) {
                var pos: Models.Game.PositionModel = this.inProgress.positions[idx];
                this.board[pos.y][pos.x] = -1;
            }

            this.selectedCells = this.inProgress.positions.length;
            for (var i in this.ships) {
                this.selectedCells += this.ships[i].positions.length;
            }

            this.canAdd = this.isShipValid();
            this.canComplete = this.selectedCells == this.POSITIONS_COUNT;
        }
    }
}