import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './url.entity';

@Injectable()
export class UrlService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}
  async createUrl(createUrlDto: CreateUrlDto) {
    if (createUrlDto.url === '') {
      throw new BadRequestException('Url cannot be empty');
    }
    const url = this.urlRepository.create({
      originalUrl: createUrlDto.url,
      expireAt: createUrlDto.expireAt,
    });
    const saved = await this.urlRepository.save(url);
    return {
      id: saved.id.toString(),
      shortUrl: `${this.configService.get('APP_URL')}/${saved.id}`,
    };
  }
  async getUrl(id: string): Promise<string> {
    const url = await this.urlRepository.findOne(id);
    if (!url || url.expireAt < new Date()) {
      throw new NotFoundException('Url not found');
    }
    return url.originalUrl;
  }
}
