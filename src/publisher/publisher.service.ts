import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
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

            this.logger.error('Error getting publisher by id', error, 'PublisherService');
        }
    }
}
