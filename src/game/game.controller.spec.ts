import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Publisher } from '../publisher/publisher.entity';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameProducerService } from './game.producer.service';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;
  let producer: GameProducerService;

  const publisher: Publisher = {
    id: 1,
    name: 'test',
    siret: 1,
    phone: '0000000000',
  };

  const game: Game = {
    id: 1,
    title: 'Pokémon',
    price: 100,
    tags: [],
    publisher: publisher,
    releaseDate: '2021-11-20',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: {
            list: jest.fn().mockReturnValue([game]),
            findById: jest.fn().mockReturnValue(game),
            create: jest.fn().mockReturnValue(game),
            update: jest.fn().mockReturnValue(game),
            delete: jest.fn().mockReturnValue(game),
            retrievePublisherDataByGameId: jest.fn().mockReturnValue(publisher),
          },
        },
        {
          provide: GameProducerService,
          useValue: {
            timeGameAdjustments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
    producer = module.get<GameProducerService>(GameProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return InternalServerError when failing on getting games', () => {
    jest.spyOn(service, 'list').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      controller.list();
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should get list of games', () => {
    const games = controller.list();
    expect(games).toMatchObject([game]);
  });

  it('should return NotFound Exception when trying to retrieve a game that does not exists', () => {
    jest.spyOn(service, 'list').mockImplementationOnce(() => {
      throw new NotFoundException({
        error: 'Game does not exists',
      });
    });

    try {
      controller.list();
    } catch (error) {
      expect(error.response.error).toMatch('Game does not exists');
      expect(error.status).toBe(404);
    }
  });

  it('should return InternalServerError when failing to retrieve a game', () => {
    jest.spyOn(service, 'findById').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      controller.findById(1);
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should retrieve a game', () => {
    const games = controller.findById(1);
    expect(games).toMatchObject(game);
  });

  it('should return NotFound Exception when trying to create a game with an invalid publisher', () => {
    jest.spyOn(service, 'create').mockImplementationOnce(() => {
      throw new NotFoundException({
        error: 'Publisher does not exists',
      });
    });

    try {
      controller.create({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-06-12',
      });
    } catch (error) {
      expect(error.response.error).toMatch('Publisher does not exists');
      expect(error.status).toBe(404);
    }
  });

  it('should return InternalServerError when failing to create a game', () => {
    jest.spyOn(service, 'create').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      controller.create({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-06-12',
      });
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should create a game', () => {
    const gameCreated = controller.create({
      title: 'Pokémon',
      price: 100,
      publisherId: 1,
      tags: [],
      releaseDate: '2021-06-12',
    });

    expect(gameCreated).toMatchObject(game);
  });

  it('should return NotFound Exception when trying to update a game that does not exists', () => {
    jest.spyOn(service, 'update').mockImplementationOnce(() => {
      throw new NotFoundException({
        error: 'Game does not exists',
      });
    });

    try {
      controller.update(1, {
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-06-12',
      });
    } catch (error) {
      expect(error.response.error).toMatch('Game does not exists');
      expect(error.status).toBe(404);
    }
  });

  it('should return NotFound Exception when trying to update a game with a publisher that does not exists', () => {
    jest.spyOn(service, 'update').mockImplementationOnce(() => {
      throw new NotFoundException({
        error: 'Publisher does not exists',
      });
    });

    try {
      controller.update(1, {
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-06-12',
      });
    } catch (error) {
      expect(error.response.error).toMatch('Publisher does not exists');
      expect(error.status).toBe(404);
    }
  });

  it('should return InternalServerError when failing to update a game', () => {
    jest.spyOn(service, 'update').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      controller.update(1, {
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-06-12',
      });
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should update a game', () => {
    const gameUpdated = controller.update(1, {
      title: 'Pokémon',
      price: 100,
      publisherId: 1,
      tags: [],
      releaseDate: '2021-06-12',
    });

    expect(gameUpdated).toMatchObject(game);
  });

  it('should return NotFound Exception when trying to delete a game that does not exists', () => {
    jest.spyOn(service, 'delete').mockImplementationOnce(() => {
      throw new NotFoundException({
        error: 'Game does not exists',
      });
    });

    try {
      controller.delete(1);
    } catch (error) {
      expect(error.response.error).toMatch('Game does not exists');
      expect(error.status).toBe(404);
    }
  });

  it('should return InternalServerError when failing to delete a game', () => {
    jest.spyOn(service, 'delete').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      controller.delete(1);
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should delete a game', () => {
    const gameDeleted = controller.delete(1);

    expect(gameDeleted).toMatchObject(game);
  });

  it('should return NotFound Exception when trying to get publisher info of a game that does not exists', () => {
    jest
      .spyOn(service, 'retrievePublisherDataByGameId')
      .mockImplementationOnce(() => {
        throw new NotFoundException({
          error: 'Game does not exists',
        });
      });

    try {
      controller.getPublisherDataByGameId(1);
    } catch (error) {
      expect(error.response.error).toMatch('Game does not exists');
      expect(error.status).toBe(404);
    }
  });

  it('should return InternalServerError when failing to delete a game', () => {
    jest
      .spyOn(service, 'retrievePublisherDataByGameId')
      .mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

    try {
      controller.delete(1);
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should return publisher data for a given game id', () => {
    const publisherFound = controller.getPublisherDataByGameId(1);

    expect(publisherFound).toMatchObject(publisher);
  });

  it('should return alert when failing in queue process', async () => {
    jest.spyOn(producer, 'timeGameAdjustments').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      await controller.invokePriceAdjustmentTask();
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error');
    }
  });

  it('should return success message when queued success', async () => {
    jest.spyOn(producer, 'timeGameAdjustments').mockImplementationOnce(() => {
      return Promise.resolve('Task queued for process');
    });

    const result = await controller.invokePriceAdjustmentTask();
    expect(result).toBe('Task queued for process');
  });
});
