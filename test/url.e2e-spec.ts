import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UrlModule } from '../src/url/url.module';
import { UrlService } from '../src/url/url.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from '../src/config/configuration';
import { Url } from '../src/url/url.entity';

describe('UrlController (e2e)', () => {
  let app: INestApplication;
  let service: UrlService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) =>
            ({
              ...config.get('database'),
              entities: [Url],
              synchronize: true,
            } as TypeOrmModuleOptions),
          inject: [ConfigService],
        }),
        UrlModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<UrlService>(UrlService);
    await app.init();
  });

  it('/api/v1/urls (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/urls')
      .send({
        url: 'https://www.google.com',
        expireAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      })
      .expect(201);
  });

  it('/:id', async () => {
    const response: request.Response = await new Promise((resolve) => {
      request(app.getHttpServer())
        .post('/api/v1/urls')
        .send({
          url: 'https://www.google.com',
          expireAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        })
        .then((res) => resolve(res));
    });
    return request(app.getHttpServer()).get(`/${response.body.id}`).expect(302);
  });

  afterAll(async () => {
    await app.close();
  });
});
