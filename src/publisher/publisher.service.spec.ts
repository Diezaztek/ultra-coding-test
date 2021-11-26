import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';

describe('PublisherService', () => {
  let service: PublisherService;
  let repo: Repository<Publisher>;
  const publisher: Publisher = {
    id: 1,
    name: 'test',
    siret: 1,
    phone: '0000000000'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherService,
        {
          provide: getRepositoryToken(Publisher),
          useClass: Repository
        }
      ],
    }).compile();

    service = module.get(PublisherService);
    repo = module.get<Repository<Publisher>>(getRepositoryToken(Publisher));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return NotFoundException when publisher does not exists', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      throw new EntityNotFoundError(Publisher, {})
    });

    try {
      await service.findById(1);
    } catch (e) {
      expect(e.message).toMatch('Not Found');
      expect(e.status).toEqual(404)
    }
  });

  it('should return publisher when it exists', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockImplementationOnce(() => {
      return Promise.resolve(publisher);
    });
  
    const publisherFound = await service.findById(1);
    expect(publisherFound).toMatchObject(publisher);
  });
});
