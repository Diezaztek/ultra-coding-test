import { Get, Post, Put, Delete, Body, Param, Controller, Query } from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
    ApiHeader
  } from '@nestjs/swagger';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { GameProducerService } from './game.producer.service';
import { GameService } from './game.service';

@ApiTags('game')
@ApiHeader({ name: 'API-VERSION', description: 'Resource version'})
@Controller({
    path: 'game',
    version: '1'
})
export class GameController {
    constructor(
        private gameService: GameService,
        private gameProducerService: GameProducerService
    ) {}

    @Get()
    @ApiOperation({ description: 'List all games' })
    list() {
        return this.gameService.list();
    }

    @Get('/:id')
    @ApiOperation({ description: 'Retrieve a single game by id' })
    findById(@Param('id') id: number) {
        return this.gameService.findById(id);
    }

    @Get('/:id/publisher')
    @ApiOperation({ description: 'Retrieve publisher data for a given game id' })
    getPublisherDataByGameId(@Param('id') id: number) {
        return this.gameService.retrievePublisherDataByGameId(id);
    }

    @Post()
    @ApiOperation({ description: 'Create a game' })
    create(@Body() body: CreateGameDto) {
        return this.gameService.create(body);
    }

    @Post('/game-adjustment-task')
    @ApiOperation({ description: 'Start task for updating/deleting games based on its age' })
    invokePriceAdjustmentTask() {
        return this.gameProducerService.timeGameAdjustments();
    }

    @Put('/:id')
    @ApiOperation({ description: 'Update game information' })
    update(@Param('id') id: number, @Body() body: UpdateGameDto) {
        return this.gameService.update(id, body);
    }

    @Delete('/:id')
    @ApiOperation({ description: 'Delete a game' })
    delete(@Param('id') id: number) {
        return this.gameService.delete(id);
    }

}
