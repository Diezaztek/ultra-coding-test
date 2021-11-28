import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Controller,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Publisher } from '../publisher/publisher.entity';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { Game } from './game.entity';
import { GameProducerService } from './game.producer.service';
import { GameService } from './game.service';

@ApiTags('game')
@ApiHeader({ name: 'API-VERSION', description: 'Resource version' })
@Controller({
  path: 'game',
  version: '1',
})
export class GameController {
  constructor(
    private gameService: GameService,
    private gameProducerService: GameProducerService,
  ) {}

  @Get()
  @ApiOperation({ description: 'List all games' })
  @ApiOkResponse({ type: [Game] })
  list(): Promise<Game[]> {
    return this.gameService.list();
  }

  @Get('/:id')
  @ApiOperation({ description: 'Retrieve a single game by id' })
  @ApiOkResponse({ type: Game })
  findById(@Param('id') id: number): Promise<Game> {
    return this.gameService.findById(id);
  }

  @Get('/:id/publisher')
  @ApiOperation({ description: 'Retrieve publisher data for a given game id' })
  @ApiOkResponse({ type: Publisher })
  getPublisherDataByGameId(@Param('id') id: number): Promise<Publisher> {
    return this.gameService.retrievePublisherDataByGameId(id);
  }

  @Post()
  @ApiOperation({ description: 'Create a game' })
  @ApiCreatedResponse({ type: Game })
  create(@Body() body: CreateGameDto): Promise<Game> {
    return this.gameService.create(body);
  }

  @Post('/game-adjustment-task')
  @ApiOperation({
    description: 'Start task for updating/deleting games based on its age',
  })
  @ApiOkResponse({ type: String })
  invokePriceAdjustmentTask(): Promise<string> {
    return this.gameProducerService.timeGameAdjustments();
  }

  @Put('/:id')
  @ApiOperation({ description: 'Update game information' })
  @ApiOkResponse({ type: Game })
  update(@Param('id') id: number, @Body() body: UpdateGameDto): Promise<Game> {
    return this.gameService.update(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ description: 'Delete a game' })
  @ApiOkResponse({ type: Game })
  delete(@Param('id') id: number): Promise<Game> {
    return this.gameService.delete(id);
  }
}
