import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bull';
 
@Injectable()
export class GameProducerService {
  constructor(
      @InjectQueue('game-queue') private queue: Queue) {}
 
  async timeGameAdjustments() {
    try {
      await this.queue.add('adjust-games-job');
      return 'Task queued for process'
    } catch (error) {
      throw new InternalServerErrorException({
          error: 'Error queueing the process'
      });
    }
  }
}