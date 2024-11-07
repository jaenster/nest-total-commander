import {Game} from "../game/game";

export class GameCreateCommand {
    constructor(
        public readonly game: Game,
    ) {
    }
}

export class GameJoinCommand {
    constructor(
        public readonly game: Game,
        public readonly userId: number,
        public readonly balance: number,
        public readonly name: string,
    ) {
    }
}