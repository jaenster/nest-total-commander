import {Deck} from "./deck";
import {Player} from "./player";

export class Game {

    public readonly players: Player[] = []
    public readonly dealer: Player = new Player("Dealer", 0);

    constructor(
        public readonly deck: Deck,
        public readonly id: number,
    ) {

    }

    toJSON() {
        return {
            id: this.id,
            players: this.players.map(player => player.toJSON()),
            dealer: this.dealer.toJSON(),
        }
    }
}