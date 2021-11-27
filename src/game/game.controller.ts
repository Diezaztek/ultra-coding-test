import { Get, Post, Put, Delete, Body, Param, Controller, Query } from '@nestjs/common';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { GameProducerService } from './game.producer.service';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService,
        private gameProducerService: GameProducerService
    ) {}

    @Get()
    list() {
        return this.gameService.list();
    }

    @Get('/:id')
    findById(@Param('id') id: number) {
        return this.gameService.findById(id);
    }

    @Get('/:id/publisher')
    getPublisherDataByGameId(@Param('id') id: number) {
        return this.gameService.retrievePublisherDataByGameId(id);
    }

    @Post()
    create(@Body() body: CreateGameDto) {
        return this.gameService.create(body);
    }

    @Post('/price-adjustment-task')
    invokePriceAdjustmentTask() {
        return this.gameProducerService.timeGameAdjustments();
    }

    @Put('/:id')
    update(@Param('id') id: number, @Body() body: UpdateGameDto) {
        return this.gameService.update(id, body);
    }

    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.gameService.delete(id);
    }

}
