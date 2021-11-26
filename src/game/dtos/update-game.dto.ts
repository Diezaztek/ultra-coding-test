import { IsString, IsNumber, IsArray, IsISO8601, IsOptional } from "class-validator";

export class UpdateGameDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsNumber()
    @IsOptional()
    price: number;

    @IsNumber()
    @IsOptional()
    publisherId: number;

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    tags: string[];

    @IsISO8601()
    @IsOptional()
    releaseDate: string;
}