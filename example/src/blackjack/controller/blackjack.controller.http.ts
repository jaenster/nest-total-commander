import {Controller, Inject, Param, Post, Res, UseInterceptors} from "@nestjs/common";
import type {Response} from "express";
import {BlackjackService} from "../blackjack.service";
import {BlackjackLockInterceptor} from "../interceptor/blackjack.lock.interceptor";
import {CommandService} from "nest-total-commander";
import {GameCreateCommand, GameJoinCommand} from "../command/game.command";
import {Game} from "../game/game";

@Controller('blackjack')
@UseInterceptors(BlackjackLockInterceptor)
export class BlackjackControllerHttp {
    @Inject()
    private readonly blackjackService!: BlackjackService;

    @Inject()
    private readonly command!: CommandService;

    @Post()
    async createGame(
        @Res() response: Response,
    ) {

        const game = await this.blackjackService.createGame();

        await this.command.emit(new GameCreateCommand(game));

        response.status(201).json(game);
    }

    @Post(':gameId/join')
    async joinGame(
        @BJGame() gameId: number,
        @Res() response: Response,
    ): Promise<Game> {


        const command = new GameJoinCommand(game, "Player", 1000, 1);
        this.


    }

    @Post(':gameId/deal')
    async deal(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.deal(gameId, command);
    }

    @Post(':gameId/hit')
    async hit(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.hit(gameId, command);
    }

    @Post(':gameId/stand')
    async stand(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.stand(gameId, command);
    }

    @Post(':gameId/double')
    async double(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.double(gameId, command);
    }

    @Post(':gameId/split')
    async split(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.split(gameId, command);
    }

    @Post(':gameId/insurance')
    async insurance(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.insurance(gameId, command);
    }

    @Post(':gameId/surrender')
    async surrender(
        @Param('gameId') gameId: number,
    ): Promise<Game> {
        return this.blackjackService.surrender(gameId, command);
    }

    @Post
}