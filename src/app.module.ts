import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import appConfig from './config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { PublisherModule } from './publisher/publisher.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get<ConnectionOptions>('database');
      },
      inject: [ConfigService],
  }),
  BullModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      return configService.get('redis');
    },
    inject: [ConfigService],
  }),
    GameModule,
    PublisherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
