import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, Check, ManyToOne } from 'typeorm';
import { Publisher } from '../publisher/publisher.entity';

@Entity()
@Check('price > 0')
export class Game {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 150 })
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column('varchar', { array: true, length: 50 })
  @ApiProperty()
  tags: string[];

  @Column({ type: 'date' })
  @ApiProperty()
  releaseDate: string;

  @ManyToOne(type => Publisher, publisher => publisher.id, {
    eager: true
  })
  @ApiProperty()
  publisher: Publisher

}
