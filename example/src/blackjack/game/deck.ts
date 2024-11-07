import {Card} from "./card";

export class Deck {
    public readonly cards: Card[] = []

    constructor(
        public readonly decks = 1,
    ) {

    }

    reset() {
        this.cards.splice(0, this.cards.length);

        for (let i = 0; i < 52 * this.decks; i++) {
            this.cards.push(new Card(i % 52));
        }

        return this;
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }

        return this;
    }
    draw(): Card|undefined {
        return this.cards.pop();
    }
    get length() {
        return this.cards.length;
    }
}