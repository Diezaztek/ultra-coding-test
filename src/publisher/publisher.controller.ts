import { Post, Body, Controller } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';

@ApiTags('publisher')
@ApiHeader({ name: 'API-VERSION', description: 'Resource version' })
@Controller({
  path: 'publisher',
  version: '1',
})
export class PublisherController {
  constructor(private publisherService: PublisherService) {}

  @Post()
  @ApiOperation({ description: 'Create a game' })
  @ApiCreatedResponse({ type: Publisher })
  create(@Body() body: CreatePublisherDto): Promise<Publisher> {
    return this.publisherService.create(body);
  }
}
