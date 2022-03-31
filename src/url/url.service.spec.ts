import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import configuration from '../config/configuration';
import { Url } from './url.entity';
import { UrlService } from './url.service';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'APP_URL') return 'http://localhost:3000';
            }),
          };
        } else if (token === 'UrlRepository') {
          return {
            create: jest.fn().mockImplementation((data) => data),
            save: jest.fn().mockImplementation(async (data) => {
              return { id: 1, ...data };
            }),
            findOne: jest.fn().mockImplementation(async (id) => {
              if (id === '1') {
                return { id: 1, originalUrl: 'https://www.google.com' };
              } else return null;
            }),
          } as unknown as Repository<Url>;
        }
      })
      .compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>('UrlRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should save a shorten url record and return a response', async () => {
    const createUrlDto = {
      url: 'https://www.google.com',
      expireAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
    const response = await service.createUrl(createUrlDto);
    expect(urlRepository.save).toHaveBeenCalledWith({
      originalUrl: createUrlDto.url,
      expireAt: createUrlDto.expireAt,
    });
    expect(response).toEqual({ id: '1', shortUrl: 'http://localhost:3000/1' });
  });
  it('should throw an error when url is empty string', async () => {
    const createUrlDto = {
      url: '',
      expireAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
    expect(async () => service.createUrl(createUrlDto)).rejects.toThrowError();
  });
  it('should get an original url', async () => {
    const originalUrl = await service.getUrl('1');
    expect(originalUrl).toEqual('https://www.google.com');
  });
  it('should throw an error when shorten url not found', async () => {
    expect(async () => service.getUrl('2')).rejects.toThrowError();
  });
});
