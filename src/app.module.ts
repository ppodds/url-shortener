import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UrlModule } from './url/url.module';
import configuration from './config/configuration';
import { Url } from './url/url.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        ({
          ...config.get('database'),
          entities: [Url],
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    UrlModule,
  ],
})
export class AppModule {}
