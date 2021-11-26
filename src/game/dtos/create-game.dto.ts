import { IsString, IsNumber, IsArray, IsISO8601, IsOptional } from "class-validator";

export class CreateGameDto {
    @IsString()
    title: string;

    @IsNumber()
    price: number;

    @IsNumber()
    publisherId: number;

    @IsArray()
    @IsString({each: true})
    tags: string[];

    @IsISO8601()
    releaseDate: string;
}