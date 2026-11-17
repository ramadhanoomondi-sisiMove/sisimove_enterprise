// -----------------------------------------------------------------------------
// Financial Disbursement — Attempt Succeeded Subscriber
// -----------------------------------------------------------------------------
//
// Application event subscriber responsible for initiating completion of a
// Financial Disbursement after a provider attempt has succeeded.
//
// Responsibilities:
//
// 1. Subscribe to FinancialDisbursementAttemptSucceededEvent.
// 2. Acquire an idempotent processing claim.
// 3. Execute CompleteFinancialDisbursementCommand.
// 4. Mark the event as processed using the claim token.
//
// The subscriber does NOT:
//
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Perform accounting.
// - Execute payment providers.
// - Complete the aggregate directly.
//
// Financial posting and completion belong to
// CompleteFinancialDisbursementHandler.
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

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import { CompleteFinancialDisbursementCommand } from '../commands/complete-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { FinancialDisbursementAttemptSucceededEvent } from '../../domain/events/financial-disbursement-attempt-succeeded.event';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { FinancialDisbursementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CONSUMER_NAME = 'FinancialDisbursementAttemptSucceededSubscriber';

const CLAIM_LEASE_DURATION_MS = 120_000;

// -----------------------------------------------------------------------------
// Subscriber
// -----------------------------------------------------------------------------

@Injectable()
export class FinancialDisbursementAttemptSucceededSubscriber implements OnModuleInit {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeDisbursementHandler: CommandHandler<
      CompleteFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialDisbursementAttemptSucceededEvent>(
      'FinancialDisbursementAttemptSucceeded',
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(
    event: FinancialDisbursementAttemptSucceededEvent,
  ): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Acquire an exclusive processing claim
    // -------------------------------------------------------------------------
    //
    // The claim prevents multiple workers from processing the same event
    // concurrently for this consumer.
    //
    // A null token means the event has already been processed or another
    // worker currently owns an unexpired claim.
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
    // 2. Execute disbursement financial posting and completion
    // -------------------------------------------------------------------------
    //
    // The completion handler is responsible for:
    //
    // - Loading the Financial Disbursement aggregate.
    // - Validating the successful provider attempt.
    // - Creating and posting the Financial Transaction.
    // - Applying the appropriate Financial Account balance movements.
    // - Creating and posting the Accounting Journal.
    // - Linking the Financial Transaction to the disbursement.
    // - Transitioning PROCESSING → COMPLETED.
    // - Persisting all changes atomically.
    // - Publishing the resulting domain events.
    //
    // Genuine posting or completion errors must propagate to the event
    // dispatcher.
    //
    // If execution fails, the event is not marked as processed. The claim
    // remains until its lease expires, allowing a later retry.
    // -------------------------------------------------------------------------

    await this.completeDisbursementHandler.execute(
      new CompleteFinancialDisbursementCommand(
        new FinancialDisbursementPublicId(event.disbursementPublicId.value),
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
      ),
    );

    // -------------------------------------------------------------------------
    // 3. Mark event processed
    // -------------------------------------------------------------------------
    //
    // The claim token proves ownership.
    //
    // The idempotency store must reject completion if the claim has expired
    // or has been replaced by another worker.
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

export default FinancialDisbursementAttemptSucceededSubscriber;
