import {Inject, Injectable} from "@nestjs/common";
import {BLACKJACK_STORAGE} from "../constants";
import {BlackjacksStorageInterface} from "./blackjack.storage.interface";
import {Game} from "./game/game";

@Injectable()
export class BlackjackService {

    @Inject(BLACKJACK_STORAGE)
    private readonly storage!: BlackjacksStorageInterface;


    getGame(gameId: number) {
        return this.storage.getGame(gameId);
    }

    saveGame(game: Game) {
        return this.storage.saveGame(game);
    }

    async createGame() {
        return this.storage.createGame();
    }
}