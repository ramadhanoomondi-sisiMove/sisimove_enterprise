// -----------------------------------------------------------------------------
// Financial Payment — Succeeded Subscriber
// -----------------------------------------------------------------------------
//
// Application event subscriber responsible for initiating financial posting
// after a Financial Payment has been successfully confirmed.
//
// Responsibilities:
//
// 1. Subscribe to FinancialPaymentSucceededEvent.
// 2. Check event idempotency.
// 3. Execute PostSuccessfulFinancialPaymentCommand.
// 4. Mark the event as processed after successful handler completion.
//
// The subscriber does NOT:
//
// - Create Financial Transactions directly.
// - Modify Financial Account balances.
// - Perform accounting.
// - Execute payment providers.
// - Perform settlement.
//
// Financial posting belongs to PostSuccessfulFinancialPaymentHandler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Event Bus
// -----------------------------------------------------------------------------

import { EventBus } from '../../../../infrastructure/events/event-bus';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import { PostSuccessfulFinancialPaymentCommand } from '../commands/post-successful-financial-payment.command';

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { FinancialPaymentSucceededEvent } from '../../domain/events/financial-payment-succeeded.event';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CONSUMER_NAME = 'FinancialPaymentSucceededSubscriber';

// -----------------------------------------------------------------------------
// Subscriber
// -----------------------------------------------------------------------------

@Injectable()
export class FinancialPaymentSucceededSubscriber implements OnModuleInit {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.POST_SUCCESSFUL)
    private readonly postSuccessfulPaymentHandler: CommandHandler<
      PostSuccessfulFinancialPaymentCommand,
      void
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialPaymentSucceededEvent>(
      'FinancialPaymentSucceeded',
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(event: FinancialPaymentSucceededEvent): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Check whether this event has already been processed
    // -------------------------------------------------------------------------

    if (await this.idempotencyStore.exists(CONSUMER_NAME, eventId)) {
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Execute financial posting
    // -------------------------------------------------------------------------
    //
    // The posting handler is responsible for:
    //
    // - Loading the confirmed Financial Payment.
    // - Validating that the payment is SUCCEEDED.
    // - Preventing duplicate Financial Transaction creation.
    // - Creating and posting the Financial Transaction.
    // - Linking the resulting transaction to the payment.
    // - Persisting the complete financial posting atomically.
    //
    // Genuine posting errors must propagate to the event dispatcher.
    // -------------------------------------------------------------------------

    await this.postSuccessfulPaymentHandler.execute(
      new PostSuccessfulFinancialPaymentCommand(
        event.publicId,
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
      ),
    );

    // -------------------------------------------------------------------------
    // 3. Mark event processed
    // -------------------------------------------------------------------------
    //
    // Only mark after successful posting handler completion.
    //
    // Never put this operation in a finally block.
    //
    // If posting fails, the event must remain eligible for retry.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentSucceededSubscriber;
