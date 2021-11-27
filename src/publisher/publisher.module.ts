import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher])],
  providers: [
    PublisherService,
    Logger
  ],
  exports: [PublisherService]
})
export class PublisherModule {}
