import { Entity, PrimaryGeneratedColumn, Column, Check, ManyToOne } from 'typeorm';
import { Publisher } from '../publisher/publisher.entity';

@Entity()
@Check('price > 0')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column()
  price: number;

  @Column('varchar', { array: true, length: 50 })
  tags: string[];

  @Column({ type: 'date' })
  releaseDate: string;

  @ManyToOne(type => Publisher, publisher => publisher.id, {
    eager: true
  })
  publisher: Publisher

}
