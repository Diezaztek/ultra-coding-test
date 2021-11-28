import { Process, Processor } from "@nestjs/bull";
import { Logger, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import { LessThan } from "typeorm";
import { GameService } from "./game.service";
 
@Processor('game-queue')
@Injectable()
export class GameConsumer {
    constructor(
        private gameService: GameService,
        private configService: ConfigService,
        private logger: Logger
    ){}

    substractMonths(monthsToSubstract: number) {
        const today = new Date();
        const dateDeleteGames = new Date(today.setMonth(today.getMonth() - monthsToSubstract))
        const ISOFormatDate = dateDeleteGames.toISOString().split('T')[0];

        return ISOFormatDate
    }
 
    @Process('adjust-games-job')
    async readOperationJob(job:Job<unknown>): Promise<void> {
        this.logger.log('Game catalog adjusment by date old started', 'GameConsumer');
        const taskConfigs = this.configService.get('tasks.games')
        const { 
            monthsOldForDeletion,
            startMonthsOldForDisscount,
            endMonthsOldForDisscount,
            disccount 
        } = taskConfigs;

        try {
            const dateDeleteGames = this.substractMonths(monthsOldForDeletion);
            const gamesDeleted = await this.gameService.deleteBasedOnCondition({
                where: {
                    releaseDate: LessThan(dateDeleteGames)
                }
            });
            this.logger.verbose(`Games successfully deleted. ${gamesDeleted.length} games affected`, 'GameConsumer');

            const gamesUpdated = await this.gameService.updateBasedOnCondition(
                { price: () => `price * ${(100 - disccount)/100}` },
                'releaseDate between :startDate and :endDate',
                { 
                    startDate: this.substractMonths(startMonthsOldForDisscount),
                    endDate: this.substractMonths(endMonthsOldForDisscount)    
                }
            );
            this.logger.verbose(`Games successfully updated its prices. ${gamesUpdated.affected} games affected`, 'GameConsumer');
        } catch (error) {
            this.logger.error(`Error adjusting games: ${error}`, 'GameConsumer');
        }
        
    }
}