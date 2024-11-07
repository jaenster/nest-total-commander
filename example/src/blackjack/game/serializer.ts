import {Card} from "./card";
import {Deck} from "./deck";
import {Game} from "./game";
import {Hand} from "./hand";
import {Player} from "./player";

const enum SerializedType {
    Card ,
    Deck ,
    Game ,
    Hand ,
    Player,
}

type SerializedCard = [SerializedType.Card, number];
type SerializedDeck = [SerializedType.Deck, cards: SerializedCard[], decks: number];
type SerializedPlayer = [SerializedType.Player, hands: SerializedHand[], balance: number, name: string, userId?: number];
type SerializedGame = [SerializedType.Game, players: SerializedPlayer[], dealer: SerializedPlayer, deck: SerializedDeck];
type SerializedHand = [SerializedType.Hand, card: SerializedCard[], bet: number, done: boolean];


export function serialize(data: Card): SerializedCard;
export function serialize(data: Deck): SerializedDeck;
export function serialize(data: Game): SerializedGame;
export function serialize(data: Hand): SerializedHand;
export function serialize(data: Player): SerializedPlayer;
export function serialize(data: Card|Deck|Game|Hand|Player) {
    switch(true){
        case data instanceof Card:
            return [SerializedType.Card, data.index];
        case data instanceof Deck:
            return [SerializedType.Deck, data.cards.map((card: Card) => serialize(card)), data.decks];
        case data instanceof Game:
            return [SerializedType.Game, data.players.map(player => serialize(player)), serialize(data.dealer), serialize(data.deck)]
        case data instanceof Hand:
            return [SerializedType.Hand, data.cards.map(card => serialize(card)), data.bet, data.done];
        case data instanceof Player:
            return [SerializedType.Player, data.hands.map(hand => serialize(hand)), data.balance, data.name, data.userId];
        default:
            throw new Error('Unknown data type');
    }
}

export function deserialize(data: SerializedCard): Card;
export function deserialize(data: SerializedDeck): Deck;
export function deserialize(data: SerializedGame): Game;
export function deserialize(data: SerializedHand): Hand;
export function deserialize(data: SerializedPlayer): Player;
export function deserialize(data: SerializedCard|SerializedDeck|SerializedGame|SerializedHand|SerializedPlayer): Card|Deck|Game|Hand|Player {
    switch(data[0]){
        case SerializedType.Card: {
            return new Card(data[1]);
        }
        case SerializedType.Deck: {
            const [_, cards, decks] = data as SerializedDeck;
            const deck = new Deck(decks);
            Object.assign<Deck, Partial<Deck>>(deck, {cards: cards.map(card => deserialize(card))});
            return deck;
        }
        case SerializedType.Game: {
            const [_, players, dealer, deck] = data as SerializedGame;
            const game = new Game(deserialize(deck), 0);
            Object.assign<Game, Partial<Game>>(game, {
                players: players.map(player => deserialize(player)),
                dealer: deserialize(dealer),
            });
            return game;
        }
        case  SerializedType.Hand: {
            const [_, cards, bet, done] = data as SerializedHand;
            const hand = new Hand(bet);
            Object.assign<Hand, Partial<Hand>>(hand, {cards: cards.map(card => deserialize(card), done)});
            return hand;
        }
        case SerializedType.Player: {
            const [_, hands, balance, name, userId] = data as SerializedPlayer;
            const player = new Player(name, balance, userId);
            Object.assign<Player, Partial<Player>>(player, {hands: hands.map(hand => deserialize(hand))});
            return player;
        }
        default:
            throw new Error('Unknown data type');
    }
}