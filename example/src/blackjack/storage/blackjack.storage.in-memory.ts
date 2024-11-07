import {Injectable} from "@nestjs/common";
import {BlackjacksStorageInterface} from "../blackjack.storage.interface";
import {Game} from "../game/game";
import {Player} from "../game/player";
import {Observable, Subject} from "rxjs";
import {Deck} from "../game/deck";

type GetPromise<T> = {
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
    promise: Promise<T>;
}

function getPromise<T>(): GetPromise<T> {
    let resolve: (value: T) => void;
    let reject: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {resolve: resolve!, reject: reject!, promise};
}

type EventMap = Map<Game, Subject<Game>> & Map<Player, Subject<Player>> & Map<number, Set<Subject<Player&Game>>>;

@Injectable()
export class BlackjackStorageInMemory implements BlackjacksStorageInterface {


    private gameId = 0;
    public readonly locks = new Map<Game, GetPromise<void>>()
    public readonly games = new Map<number, Game>();

    public readonly events: EventMap = new Map();

    async createGame(): Promise<Game> {
        const id = this.gameId++;
        const deck = new Deck(6)
        const game = new Game(deck, id);
        this.games.set(game.id, game);
        return game;
    }
    async getGame(gameId: number): Promise<Game|undefined> {
        return this.games.get(gameId);
    }
    async saveGame(game: Game): Promise<void> {
        this.games.set(game.id, game);
    };
    async deleteGame(game: Game): Promise<void> {
        this.games.delete(game.id);
    };


    async lockGame(game: Game): Promise<void> {
        if (this.locks.has(game)) {
            do {
                await this.locks.get(game)!.promise;
            } while(this.locks.has(game));
        }

        const {resolve, reject, promise} = getPromise<void>();
        this.locks.set(game, {resolve, reject, promise});
        return promise;
    }
    async unlockGame(game: Game): Promise<void> {
        const lock = this.locks.get(game);
        if (lock) {
            lock.resolve();
            this.locks.delete(game);
        }
    }

    async emitGame(game: Game): Promise<void> {
        let subject = this.events.get(game);
        if (!subject) this.events.set(game, subject = new Subject<Game>());
        subject.next(game);
    }
    async emitPlayer(game: Game, player: Player): Promise<void> {
        let subject = this.events.get(player);
        if (!subject) this.events.set(player, subject = new Subject<Player>());
        subject.next(player);
    }
    async emitDealer(game: Game): Promise<void> {
        let subject = this.events.get(game.dealer);
        if (!subject) this.events.set(game.dealer, subject = new Subject<Player>());
        subject.next(game.dealer);
    }

    async listenGame(game: Game): Promise<Observable<Game>> {
        let subject = this.events.get(game);
        if (!subject) this.events.set(game, subject = new Subject<Game>());
        return subject.asObservable();
    }
    async listenDealer(game: Game): Promise<Observable<Player>> {
        let subject = this.events.get(game.dealer);
        if (!subject) this.events.set(game.dealer, subject = new Subject<Player>());
        return subject.asObservable();
    }
    async listenPlayer(game: Game): Promise<Observable<Player>> {
        let subject = this.events.get(game.players[0]);
        if (!subject) this.events.set(game.players[0], subject = new Subject<Player>());
        return subject.asObservable();
    }


}