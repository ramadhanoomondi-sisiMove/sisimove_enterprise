import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';
import { ProcessFinancialPaymentHandler } from '../command-handlers/process-financial-payment.handler';

@Injectable()
export class StkPaymentCallbackWorker {
  private readonly logger = new Logger(StkPaymentCallbackWorker.name);
  private isRunning = false;

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processFinancialPayment: ProcessFinancialPaymentHandler,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async processPendingCallbacks(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const result =
        await this.processFinancialPayment.processPendingStkCallbacks(50);

      if (result.scanned > 0) {
        this.logger.log(
          `STK callback recovery batch completed: ${JSON.stringify(result)}`,
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`STK callback recovery failed: ${message}`);
    } finally {
      this.isRunning = false;
    }
  }
}
