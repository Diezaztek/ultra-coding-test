import { IsString, IsNumber, IsArray, IsISO8601 } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
    @IsString()
    @ApiProperty()
    title: string;

    @IsNumber()
    @ApiProperty()
    price: number;

    @IsNumber()
    @ApiProperty()
    publisherId: number;

    @IsArray()
    @IsString({each: true})
    @ApiProperty()
    tags: string[];

    @IsISO8601()
    @ApiProperty()
    releaseDate: string;
}