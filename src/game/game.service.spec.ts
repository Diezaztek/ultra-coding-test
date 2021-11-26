import { Test, TestingModule } from '@nestjs/testing';
import { Publisher } from '../publisher/publisher.entity';
import { PublisherService } from '../publisher/publisher.service';
import { GameService } from './game.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

describe('GameService', () => {
  let service: GameService;
  let publisherService: PublisherService;
  let repo: Repository<Game>;

  const publisher: Publisher = {
    id: 1,
    name: 'test',
    siret: 1,
    phone: '0000000000'
  }

  const game: Game = {
    id: 1,
    title: 'Pokémon',
    price: 100,
    tags: [],
    publisher: publisher,
    releaseDate: '2021-11-20'
  }

  beforeEach(async () => {  
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useClass: Repository
        },
        {
          provide: PublisherService,
          useValue: {
            findById: jest.fn().mockReturnValue(Promise.resolve(publisher))
          }
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    repo = module.get<Repository<Game>>(getRepositoryToken(Game));
    publisherService = module.get<PublisherService>(PublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fail when listing games', async () => {
    jest.spyOn(repo, 'find').mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await service.list();
    } catch (e) {
      expect(e.message).toMatch('Internal Server Error');
      expect(e.status).toEqual(500)
    }
  });

  it('should return a list of games', async () => {
    jest.spyOn(repo, 'find').mockImplementationOnce(() => {
      return Promise.resolve([])
    });

    const games = await repo.find();
    expect(games).toMatchObject([]);
  });

  it('should fail when getting a game that does not exists', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    try {
      await service.findById(1);
    } catch (e) {
      expect(e.message).toMatch('Not Found');
      expect(e.status).toEqual(404)
    }
  });

  it('should fail when getting a game', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await service.findById(1);
    } catch (e) {
      expect(e.message).toMatch('Internal Server Error');
      expect(e.status).toEqual(500)
    }
  });

  it('should return a game by id', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game)
    });

    const gameFound = await service.findById(1);
    expect(gameFound).toMatchObject(game);
  });

  it('should fail when trying to create a game with an invalid publisher', async () => {
    jest.spyOn(publisherService, 'findById').mockImplementationOnce(() => {
      throw new NotFoundException();
    });

    try {
      await service.create({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-11-20'
      });
    } catch (e) {
      expect(e.message).toMatch('Not Found');
      expect(e.status).toEqual(404)
    }
  });

  it('should fail when trying to create a game', async () => {
    jest.spyOn(publisherService, 'findById').mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await service.create({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-11-20'
      });
    } catch (e) {
      expect(e.message).toMatch('Internal Server Error');
      expect(e.status).toEqual(500)
    }
  });

  it('should create a new game', async () => {
    jest.spyOn(publisherService, 'findById').mockImplementationOnce(() => {
      return Promise.resolve(publisher);
    });
    jest.spyOn(repo, 'create').mockImplementationOnce(() => {
      return game
    });
    jest.spyOn(repo, 'save').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    const gameCreated = await service.create({
      title: 'Pokémon',
      price: 100,
      publisherId: 1,
      tags: [],
      releaseDate: '2021-11-20'
    });

    expect(gameCreated).toMatchObject(game);
  });

  it('should fail when trying to update a game that does not exists', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    try {
      await service.update(1, {
        price: 100,
      });
    } catch (e) {
      expect(e.message).toMatch('Not Found');
      expect(e.status).toEqual(404)
    }
  });

  it('should fail when trying to update a game with an invalid publisher', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });
    jest.spyOn(publisherService, 'findById').mockImplementationOnce(() => {
      throw new NotFoundException();
    });

    try {
      await service.update(1, {
        price: 100,
        publisherId: 1
      });
    } catch (e) {
      expect(e.message).toMatch('Not Found');
      expect(e.status).toEqual(404)
    }
  });

  it('should catch exception when update fail', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });
    jest.spyOn(repo, 'create').mockImplementationOnce(() => {
      return game
    });
    jest.spyOn(repo, 'save').mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await service.update(1, {
        price: 100,
      });
    } catch (e) {
      expect(e.message).toMatch('Internal Server Error');
      expect(e.status).toEqual(500)
    }
  });

  it('should upate game', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });
    jest.spyOn(repo, 'create').mockImplementationOnce(() => {
      return game
    });
    jest.spyOn(repo, 'save').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    const gameUpdated = await service.update(1, {
      price: 100,
    });

    expect(gameUpdated.price).toBe(100);
  });

  it('should fail when trying to delete a game that does not exists', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    try {
      await service.delete(1);
    } catch (e) {
      expect(e.message).toMatch('Not Found');
      expect(e.status).toEqual(404)
    }
  });

  it('should catch exception when deletion failed', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });
    jest.spyOn(repo, 'remove').mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await service.delete(1);
    } catch (e) {
      expect(e.message).toMatch('Internal Server Error');
      expect(e.status).toEqual(500)
    }
  });

  it('should correctly delete a game', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });
    jest.spyOn(repo, 'remove').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    const gameDeleted = await service.delete(1);
    expect(gameDeleted).toMatchObject(game);
  });
});