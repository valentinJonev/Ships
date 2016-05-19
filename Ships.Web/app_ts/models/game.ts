module Ships.Web.Models.Game {
    'use strict';

    export class CreateModel {
        first_player_id: string;
        second_player_id: string;
    }

    export class GameSetupCreateModel {
        player_id: string;
        ships: ShipModel[];
    }

    export class ShipModel {
        idx: number;
        positions: PositionModel[];
    }

    export class PositionModel {
        x: number;
        y: number;
    }

    export class GameDetailsModel {
        id: number;
        current_side: GameSideModel;
        other_side: GameSideModel;
        next_shot_player_id: string;
        winner_player_id: string;
    }

    export class GameSideModel {
        player: Account.UserGameModel;
        ships: ShipModel[];
        shots: ShotModel[];
    }

    export class ShotModel extends PositionModel {
        is_hit: boolean;
    }

    export class ShotCreateModel extends PositionModel {
        player_id: string;
    }
}