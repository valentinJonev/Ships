var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Ships;
(function (Ships) {
    var Web;
    (function (Web) {
        var Models;
        (function (Models) {
            var Game;
            (function (Game) {
                'use strict';
                var CreateModel = (function () {
                    function CreateModel() {
                    }
                    return CreateModel;
                })();
                Game.CreateModel = CreateModel;
                var GameSetupCreateModel = (function () {
                    function GameSetupCreateModel() {
                    }
                    return GameSetupCreateModel;
                })();
                Game.GameSetupCreateModel = GameSetupCreateModel;
                var ShipModel = (function () {
                    function ShipModel() {
                    }
                    return ShipModel;
                })();
                Game.ShipModel = ShipModel;
                var PositionModel = (function () {
                    function PositionModel() {
                    }
                    return PositionModel;
                })();
                Game.PositionModel = PositionModel;
                var GameDetailsModel = (function () {
                    function GameDetailsModel() {
                    }
                    return GameDetailsModel;
                })();
                Game.GameDetailsModel = GameDetailsModel;
                var GameSideModel = (function () {
                    function GameSideModel() {
                    }
                    return GameSideModel;
                })();
                Game.GameSideModel = GameSideModel;
                var ShotModel = (function (_super) {
                    __extends(ShotModel, _super);
                    function ShotModel() {
                        _super.apply(this, arguments);
                    }
                    return ShotModel;
                })(PositionModel);
                Game.ShotModel = ShotModel;
                var ShotCreateModel = (function (_super) {
                    __extends(ShotCreateModel, _super);
                    function ShotCreateModel() {
                        _super.apply(this, arguments);
                    }
                    return ShotCreateModel;
                })(PositionModel);
                Game.ShotCreateModel = ShotCreateModel;
            })(Game = Models.Game || (Models.Game = {}));
        })(Models = Web.Models || (Web.Models = {}));
    })(Web = Ships.Web || (Ships.Web = {}));
})(Ships || (Ships = {}));
