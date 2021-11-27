import { Post, Body, Controller} from '@nestjs/common';
import {
    ApiOperation,
    ApiTags,
    ApiHeader
  } from '@nestjs/swagger';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { PublisherService } from './publisher.service';

@ApiTags('publisher')
@ApiHeader({ name: 'API-VERSION', description: 'Resource version'})
@Controller({
    path: 'publisher',
    version: '1'
})
export class PublisherController {
    constructor(
        private publisherService: PublisherService,
    ) {}

    @Post()
    @ApiOperation({ description: 'Create a game' })
    create(@Body() body: CreatePublisherDto) {
        return this.publisherService.create(body);
    }

}
