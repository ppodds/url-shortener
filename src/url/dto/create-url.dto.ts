import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsDateString()
  expireAt: Date;
}
