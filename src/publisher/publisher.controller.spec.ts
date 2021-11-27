import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Publisher } from '../publisher/publisher.entity';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

describe('GameController', () => {
  let controller: PublisherController;
  let service: PublisherService;

  const publisher: Publisher = {
    id: 1,
    name: 'test',
    siret: 1,
    phone: '0000000000'
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
      providers: [
        {
          provide: PublisherService,
          useValue: {
            create: jest.fn().mockReturnValue(publisher),
          }
        },
      ]
    }).compile();

    controller = module.get<PublisherController>(PublisherController);
    service = module.get<PublisherService>(PublisherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return InternalServerError when failing to create a publisher', () => {
    jest.spyOn(service, 'create').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    try {
      controller.create({
          name: "publisher",
          siret: 1,
          phone: "55555555"
      });
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toMatch('Internal Server Error')
    }
  });

  it('should create a publisher', () => {
    const publisherCreated = controller.create({
        name: "publisher",
        siret: 1,
        phone: "55555555"
    });

    expect(publisherCreated).toMatchObject(publisher);
  });
});
