import {Player} from "../game/player";
import {Game} from "../game/game";
import {Hand} from "../game/hand";

export class PlayerHitCommand {

    constructor(
        public readonly game: Game,
        public readonly player: Player,
        public readonly handIndex: number,
    ) {

    }
}

export class PlayerPayoutCommand {
    constructor(
        public readonly game: Game,
        public readonly player: Player,
        public readonly hand: Hand,
    ) {
    }
}

export class PlayerStandCommand {

    constructor(
        public readonly game: Game,
        public readonly player: Player,
        public readonly handIndex: number,
    ) {

    }
}