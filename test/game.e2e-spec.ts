import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Game } from '../src/game/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameController } from '../src/game/game.controller';
import { GameService } from '../src/game/game.service';
import { PublisherService } from '../src/publisher/publisher.service';
import { Publisher } from '../src/publisher/publisher.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let gameRepo: Repository<Game>;
  let publisherRepo: Repository<Publisher>;

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
    const moduleFixture = await Test.createTestingModule({
      imports: [],
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useClass: Repository
        },
        {
          provide: PublisherService,
          useClass: PublisherService
        },
        {
          provide: getRepositoryToken(Publisher),
          useClass: Repository
        }
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    gameRepo = moduleFixture.get<Repository<Game>>(getRepositoryToken(Game));
    publisherRepo = moduleFixture.get<Repository<Publisher>>(getRepositoryToken(Publisher));
    await app.init();
  });

  afterAll(done => {
      app.close();
      done();
  });

  it('/game (GET) 500 Handle database error', () => {
    jest.spyOn(gameRepo, 'find').mockImplementationOnce(() => {
      throw new Error();
    });

    return request(app.getHttpServer())
      .get('/game')
      .expect(500)
      .expect({ error: 'Error getting the games' });
  });

  it('/game (GET) 200 Return games', () => {
    jest.spyOn(gameRepo, 'find').mockImplementationOnce(() => {
      return Promise.resolve([game])
    });

    return request(app.getHttpServer())
      .get('/game')
      .expect(200)
      .expect([game]);
  });

  it('/game/{id} (GET) 404 error when game not found', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    return request(app.getHttpServer())
      .get('/game/1')
      .expect(404)
      .expect({error: 'Game does not exists'});
  });

  it('/game/{id} (GET) 500 Handle database error', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new Error();
    });

    return request(app.getHttpServer())
      .get('/game/1')
      .expect(500)
      .expect({ error: 'Error finding the game' });
  });

  it('/game/{id} (GET) 200 Return matching game', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    return request(app.getHttpServer())
      .get('/game/1')
      .expect(200)
      .expect(game);
  });

  it('/game (POST) 400 invalid payload provided', () => {
    return request(app.getHttpServer())
      .post('/game')
      .expect(400);
  });

  it('/game (POST) 404 invalid publisher provided', () => {
    jest.spyOn(publisherRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Publisher, {});
    });

    return request(app.getHttpServer())
      .post('/game')
      .send({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-11-20',
      })
      .expect(404);
  });

  it('/game (POST) 500 Handled database error', () => {
    jest.spyOn(publisherRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new Error();
    });

    return request(app.getHttpServer())
      .post('/game')
      .send({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-11-20',
      })
      .expect(500)
      .expect({ error: 'Error creating the game' });
  });

  it('/game (POST) 201 Game correctly created', () => {
    jest.spyOn(publisherRepo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(publisher);
    });
    jest.spyOn(gameRepo, 'create').mockImplementationOnce(() => {
      return game
    });
    jest.spyOn(gameRepo, 'save').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    return request(app.getHttpServer())
      .post('/game')
      .send({
        title: 'Pokémon',
        price: 100,
        publisherId: 1,
        tags: [],
        releaseDate: '2021-11-20',
      })
      .expect(201)
      .expect(game);
  });

  it('/game/{id} (PUT) 404 When trying to update game that does not exists', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    return request(app.getHttpServer())
      .put('/game/1')
      .send({
        price: 100,
      })
      .expect(404)
      .expect({ error: 'Game does not exists' });
  });

  it('/game/{id} (PUT) 404 When trying to update game with publisher that does not exists', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    jest.spyOn(publisherRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Publisher, {});
    });

    return request(app.getHttpServer())
      .put('/game/1')
      .send({
        price: 100,
        publisherId: 1,
      })
      .expect(404)
      .expect({ error: 'The publisher does not exists' });
  });

  it('/game/{id} (PUT) 500 manage exception when database fails', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new Error();
    });

    return request(app.getHttpServer())
      .put('/game/1')
      .send({
        price: 100,
      })
      .expect(500)
      .expect({ error: 'Error updating the game' });
  });

  it('/game/{id} (PUT) 200 update successfull', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    jest.spyOn(gameRepo, 'save').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    return request(app.getHttpServer())
      .put('/game/1')
      .send({
        price: 100,
      })
      .expect(200)
      .expect(game);
  });

  it('/game/{id} (DELETE) 404 When trying to delete game that does not exists', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    return request(app.getHttpServer())
      .delete('/game/1')
      .expect(404)
      .expect({ error: 'Game does not exists' });
  });

  it('/game/{id} (DELETE) 500 handle exception in database', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new Error();
    });

    return request(app.getHttpServer())
      .delete('/game/1')
      .expect(500)
      .expect({ error: 'Error deleting the game' });
  });

  it('/game/{id} (DELETE) 200 delete game', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    jest.spyOn(gameRepo, 'remove').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    return request(app.getHttpServer())
      .delete('/game/1')
      .expect(200)
      .expect(game);
  });

  it('/game/{id}/publisher (GET) 404 When trying to get publisher info of a game that does not exists', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Game, {});
    });

    return request(app.getHttpServer())
      .get('/game/1/publisher')
      .expect(404)
      .expect({ error: 'Game does not exists' });
  });

  it('/game/{id}/publisher (GET) 500 handle exception in database', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new Error();
    });

    return request(app.getHttpServer())
      .get('/game/1/publisher')
      .expect(500)
      .expect({ error: 'Error retrieving the publisher data for the given game' });
  });

  it('/game/{id}/publisher (GET) 200 get publisher data for a given game', () => {
    jest.spyOn(gameRepo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(game);
    });

    return request(app.getHttpServer())
      .get('/game/1/publisher')
      .expect(200)
      .expect(publisher);
  });
});
