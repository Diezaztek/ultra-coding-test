import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherModule } from '../publisher/publisher.module';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), PublisherModule],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
