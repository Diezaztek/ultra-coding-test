import { Get, Post, Put, Delete, Body, Param, Controller } from '@nestjs/common';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    @Get()
    list() {
        return this.gameService.list();
    }

    @Get('/:id')
    findById(@Param('id') id: number) {
        return this.gameService.findById(id);
    }

    @Post()
    create(@Body() body: CreateGameDto) {
        return this.gameService.create(body);
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
