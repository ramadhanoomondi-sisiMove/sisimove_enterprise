import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { EventBus } from '../../../../infrastructure/events/event-bus';

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

import { ProcessFinancialAccountWithdrawalCommand } from '../commands/process-financial-account-withdrawal.command';

import { FinancialAccountWithdrawalRequestedEvent } from '../../domain/events/financial-account-withdrawal-requested.event';

import type { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialAccountWithdrawalRequestedSubscriber';

const EVENT_NAME = 'FinancialAccountWithdrawalRequested';

const CLAIM_LEASE_DURATION_MS = 120_000;

// =============================================================================
// Subscriber
// =============================================================================

@Injectable()
export class FinancialAccountWithdrawalRequestedSubscriber implements OnModuleInit {
  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processWithdrawalHandler: CommandHandler<
      ProcessFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialAccountWithdrawalRequestedEvent>(
      EVENT_NAME,
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(
    event: FinancialAccountWithdrawalRequestedEvent,
  ): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Validate Event Identity
    // -------------------------------------------------------------------------

    if (!eventId || eventId.trim().length === 0) {
      throw new Error(
        'FinancialAccountWithdrawalRequestedEvent has no valid event ID.',
      );
    }

    if (!event.withdrawalPublicId) {
      throw new Error(
        'FinancialAccountWithdrawalRequestedEvent has no withdrawal public ID.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Acquire Exclusive Processing Claim
    // -------------------------------------------------------------------------

    const claimToken = await this.idempotencyStore.acquireClaim(
      CONSUMER_NAME,
      eventId,
      CLAIM_LEASE_DURATION_MS,
    );

    if (claimToken === null) {
      // -----------------------------------------------------------------------
      // Determine whether the event has already been completed.
      // -----------------------------------------------------------------------

      const alreadyProcessed = await this.idempotencyStore.exists(
        CONSUMER_NAME,
        eventId,
      );

      if (alreadyProcessed) {
        return;
      }

      // -----------------------------------------------------------------------
      // Another worker owns the active claim.
      //
      // Do not silently acknowledge this delivery. Propagate the error so
      // the event delivery infrastructure can retry it.
      // -----------------------------------------------------------------------

      throw new Error(
        `Withdrawal request event "${eventId}" is currently being processed by another worker.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Preserve Correlation and Causation
    // -------------------------------------------------------------------------

    const correlationId = event.metadata.correlationId ?? eventId;

    const causationId = event.metadata.causationId ?? eventId;

    // -------------------------------------------------------------------------
    // 4. Dispatch Withdrawal Processing Command
    // -------------------------------------------------------------------------
    //
    // This subscriber only delegates withdrawal lifecycle processing.
    //
    // The request handler has already:
    // - Created the withdrawal request.
    // - Persisted the withdrawal.
    // - Published the requested event.
    //
    // Neither the request handler nor this subscriber:
    // - Deducts availableAmount.
    // - Modifies pendingAmount or heldAmount.
    // - Creates a Financial Account Hold.
    // - Creates a Financial Transaction.
    // - Creates a Financial Disbursement.
    // - Submits an external payment.
    //
    // ProcessFinancialAccountWithdrawalHandler owns the transition:
    //
    // PENDING -> PROCESSING
    //
    // Its processing event is handled by
    // FinancialAccountWithdrawalProcessingSubscriber.
    // -------------------------------------------------------------------------

    await this.processWithdrawalHandler.execute(
      new ProcessFinancialAccountWithdrawalCommand(
        event.withdrawalPublicId,
        correlationId,
        causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // 5. Mark Event as Processed
    // -------------------------------------------------------------------------
    //
    // Only the worker holding the current claim token can complete processing.
    //
    // If command execution or completion fails, the error propagates.
    // The event must remain eligible for delivery retry.
    //
    // Never mark an event processed in a finally block.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(
      CONSUMER_NAME,
      eventId,
      claimToken,
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default FinancialAccountWithdrawalRequestedSubscriber;
