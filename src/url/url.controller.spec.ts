import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import configuration from '../config/configuration';
import { UrlController } from './url.controller';
import { Url } from './url.entity';
import { UrlService } from './url.service';

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
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
          return {} as Repository<Url>;
        }
      })
      .compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
