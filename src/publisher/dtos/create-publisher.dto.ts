import { IsString, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublisherDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsNumber()
    @ApiProperty()
    siret: number;

    @IsString()
    @ApiProperty()
    phone: string;
}