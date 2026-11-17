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
// 2. Acquire an idempotent processing claim.
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

/**
 * Maximum time a worker may hold a processing claim.
 *
 * This should exceed the normal execution time of the financial posting
 * handler. If processing can exceed this duration, claim renewal should
 * be introduced in the idempotency infrastructure.
 */
const CLAIM_LEASE_DURATION_MS = 5 * 60 * 1000;

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
    // 2. Acquire an exclusive processing claim
    // -------------------------------------------------------------------------
    //
    // The claim prevents multiple workers from processing the same event
    // concurrently for this consumer.
    //
    // A null token means:
    //
    // - Another worker currently owns an unexpired claim; or
    // - The event has already been processed.
    //
    // In either case, this worker must not execute the command.
    // -------------------------------------------------------------------------

    const claimToken = await this.idempotencyStore.acquireClaim(
      CONSUMER_NAME,
      eventId,
      CLAIM_LEASE_DURATION_MS,
    );

    if (claimToken === null) {
      return;
    }

    // -------------------------------------------------------------------------
    // 3. Execute financial posting
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
    //
    // If posting fails, the event is NOT marked as processed.
    // The claim expires naturally, allowing a later retry.
    // -------------------------------------------------------------------------

    await this.postSuccessfulPaymentHandler.execute(
      new PostSuccessfulFinancialPaymentCommand(
        event.publicId,
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
      ),
    );

    // -------------------------------------------------------------------------
    // 4. Mark event processed
    // -------------------------------------------------------------------------
    //
    // The claim token proves ownership.
    //
    // The idempotency store must verify that this token still owns a valid,
    // unexpired claim before recording successful processing.
    //
    // Never put this operation in a finally block.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(
      CONSUMER_NAME,
      eventId,
      claimToken,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentSucceededSubscriber;
