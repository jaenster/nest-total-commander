import {Card} from "./card";

export class Hand {
    public readonly cards: Card[] = []
    public done: boolean = false;

    constructor(
        public readonly bet: number,
    ) {
    }

    get score() {
        const scores = this.cards.map(card => card.score);
        const maxScore = scores.reduce((max, score) => {
            const newMax = [];
            for (const maxVal of max) {
                for (const scoreVal of score) {
                    newMax.push(maxVal + scoreVal);
                }
            }
            return newMax;
        }, [0]);
        return maxScore.filter(score => score <= 21).sort((a, b) => b - a);
    }

    toJSON() {
        return {
            cards: this.cards.map(card => card.toJSON()),
            score: this.score,
            bet: this.bet,
            done: this.done,
        }
    }
}