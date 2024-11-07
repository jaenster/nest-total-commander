import {Controller, Inject} from "@nestjs/common";
import {Command} from "nest-total-commander";
import {GameCreateCommand, GameJoinCommand} from "../command/game.command";
import {Player} from "../game/player";
import {Game} from "../game/game";
import {BlackjacksStorageInterface} from "../blackjack.storage.interface";
import {BLACKJACK_STORAGE} from "../../constants";
import {Hand} from "../game/hand";

@Controller()
export class BlackjackHandlerGame {

    @Inject(BLACKJACK_STORAGE)
    private readonly storage!: BlackjacksStorageInterface;

    @Command(GameCreateCommand)
    async createGame(
        command: GameCreateCommand,
    ) {
        const {game} = command;

        // Reset the deck and create a new dealer
        game.deck.reset().shuffle();

        Object.assign<Game, Partial<Game>>(game, {
            dealer: new Player("Dealer", 0),
            players: []
        });
    }

    @Command(GameJoinCommand)
    async joinGame(
        command: GameJoinCommand,
    ) {
        const {game, name, userId, balance} = command;

        const player = new Player(name, balance, userId);
        game.players.push(player);

        await this.storage.emitPlayer(game, player);
    }

    @Command(GameAddHandCommand)
    async addHand(
        command: GameAddHandCommand,
    ) {
        const {game, player} = command;

        const hand = new Hand();

        player.hands.push();
    }
}