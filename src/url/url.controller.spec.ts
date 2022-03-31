import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlController } from './url.controller';
import { Url } from './url.entity';
import { UrlService } from './url.service';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;
  const createUrlDto = {
    url: 'https://www.google.com',
    expireAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'APP_URL') return 'http://localhost:3000';
            }),
          };
        } else if (token === 'UrlRepository') {
          return {} as Repository<Url>;
        } else if (token === UrlService) {
          return {
            createUrl: jest
              .fn()
              .mockImplementation(async (createUrlDto: CreateUrlDto) => {
                return {
                  id: '1',
                  shortUrl: 'http://localhost:3000/1',
                };
              }),
            getUrl: jest.fn().mockImplementation(async (id: string) => {
              return 'https://www.google.com';
            }),
          };
        }
      })
      .compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should call createUrl', async () => {
    await controller.createUrl(createUrlDto);
    expect(service.createUrl).toHaveBeenCalledWith(createUrlDto);
  });
  it('should call getUrl', async () => {
    await controller.toUrl('1', {
      redirect: jest.fn(),
    } as unknown as Response);
    expect(service.getUrl).toHaveBeenCalledWith('1');
  });
});
