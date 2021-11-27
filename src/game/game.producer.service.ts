import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Queue } from 'bull';
 
@Injectable()
export class GameProducerService {
  constructor(
      @InjectQueue('game-queue') private queue: Queue,
      private logger: Logger
  ) {}
 
  async timeGameAdjustments() {
    try {
      await this.queue.add('adjust-games-job');
      this.logger.log('Task for updating games based on age was successfully queued', 'GameProducerService')

      return 'Task queued for process'
    } catch (error) {
      this.logger.error('Error queueing task for updating games', error, 'GameProducerService')
      throw new InternalServerErrorException({
          error: 'Error queueing the process'
      });
    }
  }
}