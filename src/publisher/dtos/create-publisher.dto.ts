import { IsString, IsNumber } from "class-validator";

export class CreatePublisherDto {
    @IsString()
    name: string;

    @IsNumber()
    siret: number;

    @IsString()
    phone: string;
}