import {Game} from "../game/game";

export class DealerBustCommand {
    constructor(
        public readonly game: Game,
    ) {
    }
}

export class PlayDealerCommand {
    constructor(
        public readonly game: Game,
    ) {
    }
}