import {
  IsString,
  IsNumber,
  IsArray,
  IsISO8601,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGameDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  publisherId: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional()
  tags: string[];

  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional()
  releaseDate: string;
}
