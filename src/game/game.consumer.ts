import { Process, Processor } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import { LessThan } from "typeorm";
import { GameService } from "./game.service";
 
@Processor('game-queue')
export class GameConsumer {
    constructor(
        private gameService: GameService,
        private configService: ConfigService
    ){}

    substractMonths(monthsToSubstract: number) {
        const today = new Date();
        const dateDeleteGames = new Date(today.setMonth(today.getMonth() - monthsToSubstract))
        const ISOFormatDate = dateDeleteGames.toISOString().split('T')[0];

        return ISOFormatDate
    }
 
    @Process('adjust-games-job')
    async readOperationJob(job:Job<unknown>){
        const taskConfigs = this.configService.get('tasks.games')
        const { 
            monthsOldForDeletion,
            startMonthsOldForDisscount,
            endMonthsOldForDisscount,
            disccount 
        } = taskConfigs;

        try {
            const dateDeleteGames = this.substractMonths(monthsOldForDeletion);
            await this.gameService.deleteBasedOnCondition({
                where: {
                    releaseDate: LessThan(dateDeleteGames)
                }
            });
            console.log('Games deleted');

            await this.gameService.updateBasedOnCondition(
                { price: () => `price * ${(100 - disccount)/100}` },
                'releaseDate between :startDate and :endDate',
                { 
                    startDate: this.substractMonths(startMonthsOldForDisscount),
                    endDate: this.substractMonths(endMonthsOldForDisscount)    
                }
            );
            console.log('Games prices updated');
        } catch (error) {
            console.log(error);
        }
        
    }
}