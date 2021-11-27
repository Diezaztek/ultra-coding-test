import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherModule } from '../publisher/publisher.module';
import { GameConsumer } from './game.consumer';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameProducerService } from './game.producer.service';
import { GameService } from './game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    BullModule.registerQueue({
      name: 'game-queue'
    }),
    PublisherModule
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameProducerService,
    GameConsumer,
    Logger
  ]
})
export class GameModule {}
