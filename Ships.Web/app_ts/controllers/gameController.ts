/// <reference path="../_all.ts" />

module Ships.Web.Controllers {
    'use strict';

    export interface IGameScope extends angular.IScope {
        controller: IGameController;
    }

    export interface IGameController {
        POSITIONS_COUNT: number;
        boardCurrent: number[][];
        boardOther: number[][];
        hitCurrent: number;
        hitOther: number;
        isCurrentTurn: boolean;
        playerNames: string[];

        shoot(row: number, col: number);
    }

    export class GameController implements IGameController {
        static $inject = ['$scope', '$http', '$state', '$stateParams', 'authService', 'hubService', 'shipsWebPaths', 'Hub'];

        private MATRIX_SIZE: number = 10;
        public POSITIONS_COUNT: number = 17;
        private serviceUrl: string;
        private gameId: number;
        private game: Models.Game.GameDetailsModel;
        private hub: ngSignalr.Hub;
        private wasAlertShown: boolean = false;

        public boardCurrent: number[][];
        public boardOther: number[][];
        public hitCurrent: number;
        public hitOther: number;
        public isCurrentTurn: boolean;
        public playerNames: string[];

        constructor(private $scope: IGameScope, private $http: angular.IHttpService,
            private $state: angular.ui.IStateService, private $stateParams: angular.ui.IStateParamsService,
            private authService: Services.IAuthService, private hubService: Services.IHubService,
            private shipsWebPaths: Constants.ShipsWebPaths, private Hub: ngSignalr.HubFactory) {
            $scope.controller = this;

            if (this.$stateParams["game_id"] == null || this.$stateParams["service_url"] == null) {
                $state.go(shipsWebPaths.home.state);
            }

            this.serviceUrl = this.$stateParams["service_url"];
            this.gameId = this.$stateParams["game_id"];
            this.createHub();
            this.refreshGameDetails();
        }

        private createHub(): void {
            this.hub = this.hubService.startHub("GameHub", {
                rootPath: this.serviceUrl + "/signalr",
                logging: false,
                listeners: {
                    'handleNotification': this.handleNotification
                },
                methods: ['Notify', 'RegisterConnection']
            });

            this.hub.connection.start()
                .then(() => {
                    this.hub.invoke('RegisterConnection', this.gameId);
                });

            this.$scope.$on('$stateChangeStart', () => {
                this.hub.disconnect();
            });
        }

        public shoot(row: number, col: number) {
            if (this.canShoot(row, col)) {
                this.boardOther[row][col] = -1;

                var data: Models.Game.ShotCreateModel = {
                    x: col,
                    y: row,
                    player_id: this.authService.authorizationData.getData().user_id
                };

                this.$http.post(this.serviceUrl + "/games/" + this.gameId + "/shots", data)
                    .then(this.notify);
            }
        }

        private notify = () => {
            this.hub.invoke('Notify', this.gameId);
        }

        private handleNotification = (gameId: number, playerNames: string[]) => {
            if (gameId == this.gameId) {
                this.playerNames = playerNames;
                this.refreshGameDetails();
            }
        }

        private refreshGameDetails() {
            this.$http.get(this.serviceUrl + "/games/" + this.gameId, {
                params: {
                    user_id: this.authService.authorizationData.getData().user_id
                }
            }).then(this.onDetailsResult);
        }

        private onDetailsResult = (response: angular.IHttpPromiseCallbackArg<Models.Game.GameDetailsModel>) => {
            this.game = response.data;
            this.setBoards();

            if (this.game.winner_player_id != null) {
                var playerName: string;
                if (this.game.current_side.player.id == this.game.winner_player_id) {
                    playerName = this.game.current_side.player.name;
                }
                else {
                    playerName = this.game.other_side.player.name;
                }

                if (!this.wasAlertShown) {
                    alert(playerName + " won!");
                    this.wasAlertShown = true;
                }
                this.$state.go(this.shipsWebPaths.home.state);
            }
        }

        private setBoards() {
            this.initBoards();

            this.setBoardSide(this.game.current_side, this.boardCurrent);
            this.setBoardSide(this.game.other_side, this.boardOther);
            this.setHits();
            this.setCurrentTurn();
        }

        private setBoardSide(side: Models.Game.GameSideModel, board: number[][]) {
            if (side.ships != null) {
                for (var i in side.ships) {
                    var ship: Models.Game.ShipModel = side.ships[i];

                    for (var idx in ship.positions) {
                        var pos: Models.Game.PositionModel = ship.positions[idx];
                        board[pos.y][pos.x] = parseInt(i) + 1;
                    }
                }
            }

            for (var i in side.shots) {
                var shot: Models.Game.ShotModel = side.shots[i];

                if (shot.is_hit) {
                    board[shot.y][shot.x] = -1000;
                }
                else {
                    board[shot.y][shot.x] = -1;
                }
            }
        }

        private initBoards() {
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
        }

        private setHits() {
            this.hitCurrent = this.getHitsCount(this.boardCurrent);
            this.hitOther = this.getHitsCount(this.boardOther);
        }

        private getHitsCount(board: number[][]): number {
            var count: number = 0;
            for (var i = 0; i < this.MATRIX_SIZE; i++) {
                for (var j = 0; j < this.MATRIX_SIZE; j++) {
                    if (board[i][j] < -1) {
                        count++;
                    }
                }
            }

            return count;
        }

        private setCurrentTurn() {
            this.isCurrentTurn = this.game.next_shot_player_id == this.game.current_side.player.id;
        }

        private canShoot(row: number, col: number): boolean {
            return this.boardOther[row][col] == 0 && this.isCurrentTurn;
        }
    }
}