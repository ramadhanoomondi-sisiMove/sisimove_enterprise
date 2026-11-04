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
    // 2. Execute payment processing
    // -------------------------------------------------------------------------
    //
    // The handler is responsible for safely classifying the M-PESA outcome.
    //
    // ACCEPTED:
    //   The provider accepted the request. Await callback confirmation.
    //
    // UNCERTAIN:
    //   Preserve the active attempt. Do not submit another STK Push.
    //
    // REJECTED:
    //   Record the explicit provider rejection.
    //
    // When the handler safely records any of these outcomes and returns
    // normally, this event can be marked as processed.
    //
    // Genuine processing errors must propagate to the outbox dispatcher.
    // -------------------------------------------------------------------------

    await this.processPaymentHandler.execute(
      new ProcessFinancialPaymentCommand(
        event.publicId,
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
      ),
    );

    // -------------------------------------------------------------------------
    // 3. Mark event processed
    // -------------------------------------------------------------------------
    //
    // Only mark after successful handler completion.
    // Do not put this operation in a finally block.
    //
    // If the handler throws, the outbox must retain its retry behaviour.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}
