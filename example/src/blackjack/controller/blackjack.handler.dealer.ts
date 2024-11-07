import {Controller, Inject} from "@nestjs/common";
import {Payload} from "@nestjs/microservices";
import {Command, CommandService} from "nest-total-commander";
import {BLACKJACK_STORAGE} from "../../constants";
import {BlackjacksStorageInterface} from "../blackjack.storage.interface";
import {PlayDealerCommand} from "../command/dealer.command";
import {PlayerPayoutCommand} from "../command/player.command";

@Controller()
export class BlackjackHandlerDealer {

    @Inject()
    private readonly command!: CommandService;

    @Inject(BLACKJACK_STORAGE)
    private readonly storage!: BlackjacksStorageInterface;

    @Command(PlayDealerCommand)
    public async handleCheckDealerCommand(
        @Payload() command: PlayDealerCommand,
    ) {
        const { game } = command;

        // Dealer's turn
        // Draw cards until score is 17 or higher
        while (game.dealer.hands[0].score[0] < 17) {
            const card = game.deck.draw()!;
            game.dealer.hands[0].cards.push(card);
        }

        // Pay players with higher score
        const promises: Promise<void>[] = [];

        for(const player of game.players) {
            for(const hand of player.hands) {
                await this.command.emit(new PlayerPayoutCommand(game, player, hand))
            }
        }

        await Promise.all(promises);
        await this.storage.emitDealer(game);
    }
}