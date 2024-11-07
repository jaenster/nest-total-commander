import {Game} from "./game/game";
import {Player} from "./game/player";
import {Observable} from "rxjs";

export interface BlackjacksStorageInterface {
    getGame(gameId: number): Promise<Game|undefined>;
    saveGame(game: Game): Promise<void>;
    deleteGame(game: Game): Promise<void>;
    createGame(): Promise<Game>;

    lockGame(game: Game): Promise<void>;
    unlockGame(game: Game): Promise<void>;

    emitGame(game: Game): Promise<void>;
    emitPlayer(game: Game, player: Player): Promise<void>;
    emitDealer(game: Game): Promise<void>;

    listenGame(game: Game): Promise<Observable<Game>>;
    listenDealer(game: Game): Promise<Observable<Player>>;
    listenPlayer(game: Game): Promise<Observable<Player>>;
}