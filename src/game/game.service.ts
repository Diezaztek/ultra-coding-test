import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  EntityNotFoundError,
  FindManyOptions,
  getRepository,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dtos/create-game.dto';
import { PublisherService } from '../publisher/publisher.service';
import { UpdateGameDto } from './dtos/update-game.dto';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Publisher } from '../publisher/publisher.entity';

@Injectable()
export class GameService {
  constructor(
    private publisherService: PublisherService,
    @InjectRepository(Game) private repo: Repository<Game>,
    private logger: Logger,
  ) {}

  async list(): Promise<Game[]> {
    try {
      const games = await this.repo.find();
      return games;
    } catch (error: Error | unknown) {
      this.logger.error(`Error listing the games: ${error}`, 'GameService');
      throw new InternalServerErrorException({
        error: 'Error getting the games',
      });
    }
  }

  async findById(id: number): Promise<Game> {
    try {
      const game = await this.repo.findOneOrFail(id);
      return game;
    } catch (error: Error | unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({
          error: 'Game does not exists',
        });
      }

      this.logger.error(`Error finding a game by id: ${error}`, 'GameService');
      throw new InternalServerErrorException({
        error: 'Error finding the game',
      });
    }
  }

  async create(attrs: CreateGameDto): Promise<Game> {
    try {
      const publisher = await this.publisherService.findById(attrs.publisherId);
      const gameObject = this.repo.create({
        title: attrs.title,
        price: attrs.price,
        tags: attrs.tags,
        releaseDate: attrs.releaseDate,
      });
      gameObject.publisher = publisher;

      const gameCreated = await this.repo.save(gameObject);
      return gameCreated;
    } catch (error: Error | unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          error: 'Publisher does not exists',
        });
      }

      this.logger.error(`Error creating a game: ${error}`, 'GameService');
      throw new InternalServerErrorException({
        error: 'Error creating the game',
      });
    }
  }

  async update(id: number, attrs: Partial<UpdateGameDto>): Promise<Game> {
    try {
      const game = await this.repo.findOneOrFail(id);
      Object.assign(game, attrs);

      if ('publisherId' in attrs) {
        const publisher = await this.publisherService.findById(
          attrs.publisherId,
        );
        game.publisher = publisher;
      }

      const updatedGame = await this.repo.save(game);
      return updatedGame;
    } catch (error: Error | unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({
          error: 'Game does not exists',
        });
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException({
          error: 'The publisher does not exists',
        });
      }

      this.logger.error(`Error updating a game: ${error}`, 'GameService');
      throw new InternalServerErrorException({
        error: 'Error updating the game',
      });
    }
  }

  async delete(id: number): Promise<Game> {
    try {
      const game = await this.repo.findOneOrFail(id);
      const deletedGame = await this.repo.remove(game);
      return deletedGame;
    } catch (error: Error | unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({
          error: 'Game does not exists',
        });
      }

      this.logger.error(`Error deleting a game: ${error}`, 'GameService');
      throw new InternalServerErrorException({
        error: 'Error deleting the game',
      });
    }
  }

  async retrievePublisherDataByGameId(id: number): Promise<Publisher> {
    try {
      const game = await this.repo.findOneOrFail(id);
      return game.publisher;
    } catch (error: Error | unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException({
          error: 'Game does not exists',
        });
      }

      this.logger.error(
        `Error retrieiving publisher for a given game id: ${error}`,
        'GameService',
      );
      throw new InternalServerErrorException({
        error: 'Error retrieving the publisher data for the given game',
      });
    }
  }

  async deleteBasedOnCondition(
    options: FindManyOptions<Game>,
  ): Promise<Game[]> {
    try {
      const games = await this.repo.find(options);
      const gamesDeleted = await this.repo.remove(games);
      return gamesDeleted;
    } catch (error: Error | unknown) {
      this.logger.error(
        `Error deleting games based on condition: ${error}`,
        'GameService',
      );
      throw new InternalServerErrorException({
        error: 'Error deleting games',
      });
    }
  }

  async updateBasedOnCondition(
    values: QueryPartialEntity<Game>,
    filter: string,
    params: ObjectLiteral,
  ): Promise<UpdateResult> {
    try {
      const gamesUpdated = await getRepository(Game)
        .createQueryBuilder()
        .update()
        .set(values)
        .where(filter, params)
        .execute();
      return gamesUpdated;
    } catch (error: Error | unknown) {
      this.logger.error(
        `Error updating games based on condition: ${error}`,
        'GameService',
      );
      throw new InternalServerErrorException({
        error: 'Error deleting games',
      });
    }
  }
}
