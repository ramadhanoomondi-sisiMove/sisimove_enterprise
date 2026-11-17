// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Requested Event Subscriber
// -----------------------------------------------------------------------------
//
// Application subscriber responsible for handling a requested Financial
// Account Withdrawal.
//
// Workflow:
//
// 1. Subscribe to FinancialAccountWithdrawalRequestedEvent.
// 2. Acquire an idempotent processing claim.
// 3. Dispatch ProcessFinancialAccountWithdrawalCommand.
// 4. Preserve correlation and causation metadata.
// 5. Mark the event as processed using the claim token.
//
// Responsibilities:
//
// - React to a newly requested withdrawal.
// - Delegate processing to ProcessFinancialAccountWithdrawalHandler.
// - Prevent duplicate event processing.
// - Preserve event delivery retry behaviour.
//
// This subscriber does NOT:
//
// - Request a withdrawal.
// - Debit or credit Financial Account balances.
// - Create Financial Transactions.
// - Execute external payment providers directly.
// - Create or process disbursements directly.
// - Perform settlement or accounting.
//
// RequestFinancialAccountWithdrawalHandler owns the initial financial
// operation. ProcessFinancialAccountWithdrawalHandler owns the next
// application workflow.
//
// -----------------------------------------------------------------------------

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
  // ===========================================================================
  // Constructor
  // ===========================================================================

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

    if (!eventId) {
      throw new Error(
        'FinancialAccountWithdrawalRequestedEvent has no event ID.',
      );
    }

    if (!event.withdrawalPublicId) {
      throw new Error(
        'FinancialAccountWithdrawalRequestedEvent has no withdrawal public ID.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Acquire an Exclusive Processing Claim
    // -------------------------------------------------------------------------
    //
    // The claim prevents multiple workers from processing the same event
    // concurrently for this consumer.
    //
    // A null token means:
    //
    // - The event has already been processed; or
    // - Another worker currently owns an unexpired claim.
    //
    // In either case, this worker must not dispatch the command.
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
    // 3. Preserve Event Correlation and Causation
    // -------------------------------------------------------------------------

    const correlationId = event.metadata.correlationId ?? eventId;

    const causationId = event.metadata.causationId ?? eventId;

    // -------------------------------------------------------------------------
    // 4. Dispatch Withdrawal Processing Command
    // -------------------------------------------------------------------------
    //
    // The request handler has already:
    //
    // - Created and persisted the withdrawal.
    // - Debited the user's AVAILABLE balance.
    // - Credited SYSTEM-MPESA-CLEARING AVAILABLE balance.
    // - Created and persisted the DISBURSEMENT Financial Transaction.
    // - Published the withdrawal-requested event.
    //
    // Do not repeat those operations here.
    //
    // ProcessFinancialAccountWithdrawalHandler owns the next application
    // workflow.
    //
    // If command execution fails, the error propagates. The claim remains
    // until its lease expires, allowing a later retry.
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

export default FinancialAccountWithdrawalRequestedSubscriber;
