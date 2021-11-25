import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Publisher } from 'src/publisher/publisher.entity';

@Entity()
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
      cascade: ['insert']
  })
  publisher: Publisher; 

}
