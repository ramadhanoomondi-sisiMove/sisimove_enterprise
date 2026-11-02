import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OutboxDispatcher } from './outbox-dispatcher';

@Injectable()
export class OutboxWorker {
  private readonly logger = new Logger(OutboxWorker.name);
  private isRunning = false;

  public constructor(private readonly dispatcher: OutboxDispatcher) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async processOutbox(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const result = await this.dispatcher.dispatchBatch();

      if (result.claimed > 0) {
        this.logger.log(`Outbox batch completed: ${JSON.stringify(result)}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Outbox processing failed: ${message}`);
    } finally {
      this.isRunning = false;
    }
  }
}
