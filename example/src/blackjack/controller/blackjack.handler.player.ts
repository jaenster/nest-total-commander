import {Controller, Inject, UseGuards} from "@nestjs/common";
import {Command} from "nest-total-commander";
import {Payload} from "@nestjs/microservices";
import {CommandService} from "nest-total-commander";
import {Game} from "../game/game";
import {BLACKJACK_STORAGE} from "../../constants";
import {BlackjacksStorageInterface} from "../blackjack.storage.interface";
import {PlayerHitCommand, PlayerPayoutCommand, PlayerStandCommand} from "../command/player.command";
import {PlayDealerCommand} from "../command/dealer.command";


function IsPlayersTurnGuard() {

}

@Controller()
export class BlackjackHandlerPlayer {

    @Inject()
    public readonly command!: CommandService;

    @Inject(BLACKJACK_STORAGE)
    private readonly storage!: BlackjacksStorageInterface;

    @Command(PlayerHitCommand)
    @UseGuards(IsPlayersTurnGuard)
    public async handlePlayerHitCommand(
        @Payload() command: PlayerHitCommand,
    ) {
        const { game, player, handIndex } = command;
        const hand = player.hands[handIndex];

        // Draw a card from the deck
        const card = game.deck.draw()!;
        hand.cards.push(card);

        // check score of hand
        const score = hand.score

        switch(true) {
            case score.length === 0:
            case score[0] === 21:
            case score.length === 1 && score[0] === 21:
                // Stand command also emits player
                this.command.emit(new PlayerStandCommand(game, player, handIndex));
                break;
            default:
                await this.storage.emitPlayer(game, player);
                // Continue
        }

        // Check dealer
        if (this.allPlayersDone(game)) {
            this.command.emit(new PlayDealerCommand(game));
        }
    }

    @Command(PlayerStandCommand)
    @UseGuards(IsPlayersTurnGuard)
    public async handlePlayerStandCommand(
        @Payload() command: PlayerStandCommand,
    ) {
        const { game, player, handIndex } = command;
        const hand = player.hands[handIndex];

        hand.done = true;

        await this.storage.emitPlayer(game, player);
    }

    @Command(PlayerPayoutCommand)
    @UseGuards(IsPlayersTurnGuard)
    public async handlePlayerPayoutCommand(
        @Payload() command: PlayerPayoutCommand,
    ) {
        const { game, player, hand } = command;

        const playerScore = hand.score[0];
        const dealerScore = game.dealer.hands[0].score[0];

        switch(true) {
            case playerScore > 21: // player bust
                return;
            case playerScore === 21: // Blackjack
                player.balance += hand.bet * 2.5;
                break;
            case dealerScore > 21: // Dealer bust
            case playerScore > dealerScore: // player won
                player.balance += hand.bet * 2;
                break;
        }
        await this.storage.emitPlayer(game, player);
    }

    private allPlayersDone(game: Game) {
        return game.players.every(player => player.hands.every(hand => hand.done));
    }
}

