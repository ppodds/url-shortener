import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlService } from './url.service';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
  @Post('api/v1/urls')
  async createUrl(@Body(new ValidationPipe()) createUrlDto: CreateUrlDto) {
    return await this.urlService.createUrl(createUrlDto);
  }
  @Get(':id')
  async toUrl(@Param('id') id: string, @Res() res: Response) {
    res.redirect(await this.urlService.getUrl(id));
  }
}
