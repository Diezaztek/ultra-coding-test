import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Publisher {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 150 })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  siret: number;

  @Column({ length: 15 })
  @ApiProperty()
  phone: string;
}
