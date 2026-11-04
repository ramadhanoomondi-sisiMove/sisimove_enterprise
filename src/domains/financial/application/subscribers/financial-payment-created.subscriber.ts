import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { EventBus } from '../../../../infrastructure/events/event-bus';

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

import { FinancialPaymentCreatedEvent } from '../../domain/events/financial-payment-created.event';

import type { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

const CONSUMER_NAME = 'FinancialPaymentCreatedSubscriber';

@Injectable()
export class FinancialPaymentCreatedSubscriber implements OnModuleInit {
  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processPaymentHandler: CommandHandler<
      ProcessFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialPaymentCreatedEvent>(
      'FinancialPaymentCreated',
      async (event) => this.handle(event),
    );
  }

  private async handle(event: FinancialPaymentCreatedEvent): Promise<void> {
    const eventId = event.metadata.eventId;

    if (await this.idempotencyStore.exists(CONSUMER_NAME, eventId)) {
      return;
    }

    await this.processPaymentHandler.execute(
      new ProcessFinancialPaymentCommand(
        event.publicId,
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
      ),
    );

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}
