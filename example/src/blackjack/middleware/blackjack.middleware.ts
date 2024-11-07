import {Request} from 'express';
import {Inject} from "@nestjs/common";
import {BLACKJACK_STORAGE} from "../../constants";
import {BlackjacksStorageInterface} from "../blackjack.storage.interface";
import {Game} from "../game/game";


export class BlackjackMiddleware {

    @Inject(BLACKJACK_STORAGE)
    private readonly storage!: BlackjacksStorageInterface;


    async use(req: Request, res: any, next: () => void): Promise<void> {
        const gameId = parseInt(req.params['gameId']);
        if (!gameId) {
            return next();
        }

        const game = await this.storage.getGame(gameId);
        if (!game) {
            return next();
        }

        req.game = game;
        return next();
    }
}
