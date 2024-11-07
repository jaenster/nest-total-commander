import {Inject, Injectable, NestInterceptor} from "@nestjs/common";
import {ExecutionContext} from "@nestjs/common/interfaces/features/execution-context.interface";
import {CallHandler} from "@nestjs/common/interfaces/features/nest-interceptor.interface";
import {tap} from "rxjs";
import {BLACKJACK_STORAGE} from "../../constants";
import {BlackjacksStorageInterface} from "../blackjack.storage.interface";
import {Game} from "../game/game";

@Injectable()
export class BlackjackLockInterceptor implements NestInterceptor {

    @Inject(BLACKJACK_STORAGE)
    private readonly storage!: BlackjacksStorageInterface;

    async intercept(context: ExecutionContext, next: CallHandler<unknown>) {
        let game: Game|undefined = undefined
        switch(context.getType()) {
            case "http": {
                const request = context.switchToHttp().getRequest();
                const gameId = request.params.gameId;
                if (gameId) game = await this.storage.getGame(gameId);
                break;
            }
            case "rpc": {
                const rpc = context.switchToRpc();
                game = rpc.getData().game;
                if (!game) {
                    const gameId = rpc.getData().gameId as number | undefined;
                    if (gameId) game = await this.storage.getGame(gameId);
                }
                break;
            }
            default:
                return next.handle();
        }

        if (!game) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(() => this.storage.unlockGame(game))
        );
    }
}