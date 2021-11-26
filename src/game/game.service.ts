import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dtos/create-game.dto';
import { PublisherService } from '../publisher/publisher.service';
import { UpdateGameDto } from './dtos/update-game.dto';

@Injectable()
export class GameService {
    constructor(
        private publisherService: PublisherService,
        @InjectRepository(Game) private repo: Repository<Game>
    ){}

    async list() {
        try {
            const games = await this.repo.find();
            return games;
        } catch (error: Error | unknown) {
            throw new InternalServerErrorException({
                error: 'Error getting the games'
            })
        }
        
    }

    async findById(id: number) {
        try {
            const game = await this.repo.findOneOrFail(id);
            return game;
        } catch (error: Error | unknown) {
            if (error instanceof EntityNotFoundError) {
				throw new NotFoundException({
                    error: 'Game does not exists',
                });
			}

            throw new InternalServerErrorException({
                error: 'Error finding the game'
            })
        }
    }

    async create(attrs: CreateGameDto) {
        try {
            const publisher = await this.publisherService.findById(attrs.publisherId);
            const gameObject = this.repo.create({
                title: attrs.title,
                price:attrs.price,
                publisher,
                tags: attrs.tags,
                releaseDate: attrs.releaseDate,
            });

            const createdGame = await this.repo.save(gameObject);
            return createdGame;
        } catch (error: Error | unknown) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    error: 'Publisher does not exists'
                });
            }

            throw new InternalServerErrorException({
                error: 'Error creating the game'
            })
        }
    }

    async update(id: number, attrs: Partial<UpdateGameDto>) {
        try {
            const game = await this.repo.findOneOrFail(id);
            Object.assign(game, attrs);

            if ('publisherId' in attrs) {
                const publisher = await this.publisherService.findById(attrs.publisherId);
                console.log(publisher);
                game.publisher = publisher;
            }

            const updatedGame = await this.repo.save(game);
            return updatedGame;
        } catch (error: Error | unknown) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundException({
                    error: 'Game does not exists'
                });
            } else if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    error: 'The publisher does not exists'
                });
            }

            throw new InternalServerErrorException({
                error: 'Error updating the game'
            })
        }
    }

    async delete(id: number) {
        try {
            const game = await this.repo.findOneOrFail(id);
            const deletedGame = await this.repo.remove(game);
            return deletedGame;
        } catch (error: Error | unknown) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundException({
                    error: 'Game does not exists'
                });
            }

            throw new InternalServerErrorException({
                error: 'Error deleting the game'
            })
        }
    }
}
