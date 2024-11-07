export class Card {
    public readonly suit: number;
    public readonly value: number;

    static readonly suits = ['♠', '♣', '♦', '♥'];
    static readonly values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    constructor(
        public readonly index: number
    ) {
        this.suit = Math.floor(index / 13);
        this.value = index % 13 + 1;
    }

    get name() {
        return Card.values[this.value - 1] + Card.suits[this.suit];
    }

    get score() {
        // Aces are worth 11 points or 1 point, depending on which is more beneficial
        return this.value === 1 ? [1, 11] : this.value > 10 ? [10] : [this.value];
    }

    toJSON() {
        const {index} = this
        return {index}
    }
}