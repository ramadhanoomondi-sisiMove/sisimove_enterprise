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
// 2. Check whether the event has already been processed.
// 3. Dispatch ProcessFinancialAccountWithdrawalCommand.
// 4. Preserve correlation and causation metadata.
// 5. Mark the event as processed after successful command execution.
//
// Responsibilities:
//
// - React to a newly requested withdrawal.
// - Trigger the withdrawal processing application workflow.
// - Prevent duplicate processing through idempotency.
// - Preserve event delivery retry behaviour.
//
// This subscriber does NOT:
//
// - Execute external payment providers directly.
// - Modify Financial Account balances directly.
// - Create Financial Transactions directly.
// - Perform settlement.
// - Perform accounting.
//
// The ProcessFinancialAccountWithdrawalHandler owns the next application
// workflow. Provider execution and disbursement responsibilities remain
// within their respective application and integration boundaries.
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
// Foundation — Idempotency
// -----------------------------------------------------------------------------

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';

// -----------------------------------------------------------------------------
// Foundation — Command Handler
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Application — Command
// -----------------------------------------------------------------------------

import { ProcessFinancialAccountWithdrawalCommand } from '../commands/process-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Domain — Event
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalRequestedEvent } from '../../domain/events/financial-account-withdrawal-requested.event';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialAccountWithdrawalRequestedSubscriber';

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
      'FinancialAccountWithdrawalRequested',
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
    // 1. Check whether this event has already been processed
    // -------------------------------------------------------------------------

    if (await this.idempotencyStore.exists(CONSUMER_NAME, eventId)) {
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Execute withdrawal processing workflow
    // -------------------------------------------------------------------------
    //
    // The subscriber delegates the next workflow to
    // ProcessFinancialAccountWithdrawalHandler.
    //
    // The handler is responsible for applying the withdrawal processing
    // business rules and coordinating the appropriate downstream workflow.
    //
    // The subscriber does not execute a provider or create a disbursement
    // directly.
    // -------------------------------------------------------------------------

    await this.processWithdrawalHandler.execute(
      new ProcessFinancialAccountWithdrawalCommand(
        event.withdrawalPublicId,
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
      ),
    );

    // -------------------------------------------------------------------------
    // 3. Mark event processed
    // -------------------------------------------------------------------------
    //
    // Only mark after successful command-handler completion.
    //
    // Do not place this operation in a finally block.
    //
    // If processing throws, the error must propagate to the outbox dispatcher
    // so the event retains its retry behaviour.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalRequestedSubscriber;
