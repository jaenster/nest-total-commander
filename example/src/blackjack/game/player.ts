import {Hand} from "./hand";

export class Player {
    public readonly hands: Hand[] = [];

    constructor(
        public readonly name: string,
        public balance: number,
        public readonly userId?: number,
    ) {

    }

    toJSON() {
        return {
            name: this.name,
            balance: this.balance,
            hands: this.hands.map(hand => hand.toJSON()),
        }
    }
}