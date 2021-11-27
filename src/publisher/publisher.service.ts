import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { Publisher } from './publisher.entity';

@Injectable()
export class PublisherService {
    constructor(
        @InjectRepository(Publisher) private repo: Repository<Publisher>,
        private logger: Logger
    ){}

    async findById(id: number) {
        try {
            const game = await this.repo.findOneOrFail(id);
            return game;
        } catch (error: Error | unknown) {
            if (error instanceof EntityNotFoundError) {
				throw new NotFoundException;
			}
            this.logger.error(`Error getting a publisher by id: ${error}`, 'PublisherService');
        }
    }

    async create(attrs: CreatePublisherDto) {
        try {
            const publisherObject = this.repo.create(attrs);

            const publisherCreated = await this.repo.save(publisherObject);
            return publisherCreated;
        } catch (error: Error | unknown) {
            this.logger.error(`Error creating a publisher: ${error}`, 'PublisherService');
            throw new InternalServerErrorException({
                error: 'Error creating the game'
            });
        }
    }
}
