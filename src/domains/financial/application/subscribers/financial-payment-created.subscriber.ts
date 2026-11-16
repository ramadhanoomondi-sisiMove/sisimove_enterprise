import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { EventBus } from '../../../../infrastructure/events/event-bus';

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

import { FinancialPaymentCreatedEvent } from '../../domain/events/financial-payment-created.event';

import type { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialPaymentCreatedSubscriber';

// =============================================================================
// Subscriber
// =============================================================================

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

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialPaymentCreatedEvent>(
      'FinancialPaymentCreated',
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(event: FinancialPaymentCreatedEvent): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Check whether this event has already been processed
    // -------------------------------------------------------------------------

    if (await this.idempotencyStore.exists(CONSUMER_NAME, eventId)) {
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Route payment according to its execution channel
    // -------------------------------------------------------------------------

    if (event.channel.isStkPush()) {
      // STK Push is initiated by SisiMove.
      // Preserve the existing payment-processing workflow.

      await this.processPaymentHandler.execute(
        new ProcessFinancialPaymentCommand(
          event.publicId,
          event.metadata.correlationId ?? eventId,
          event.metadata.causationId ?? eventId,
        ),
      );
    } else if (event.channel.isC2B()) {
      // C2B is an incoming customer-initiated payment.
      // Do not initiate STK Push or execute the outbound payment handler.
      // The Daraja C2B callback will drive payment processing.
    } else {
      throw new Error(
        `Unsupported Financial Payment Channel: ${event.channel.toString()}`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Mark event processed
    // -------------------------------------------------------------------------

    // Mark only after the relevant channel handling completes.
    // If STK processing throws, allow the outbox retry behaviour to continue.

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}
