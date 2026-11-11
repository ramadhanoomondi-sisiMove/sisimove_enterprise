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
// 5. Mark the event as processed only after successful command execution.
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
    // 2. Check Event Idempotency
    // -------------------------------------------------------------------------
    //
    // An already processed event must not dispatch the processing command
    // again.
    //
    // The withdrawal itself also has its own business-level idempotency.
    // Event idempotency and withdrawal idempotency serve different purposes.
    // -------------------------------------------------------------------------

    const alreadyProcessed = await this.idempotencyStore.exists(
      CONSUMER_NAME,
      eventId,
    );

    if (alreadyProcessed) {
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
    // Mark only after successful command execution.
    //
    // If command execution fails, the error propagates to the event dispatcher.
    // The event remains eligible for retry.
    //
    // Do not move this into a finally block.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalRequestedSubscriber;
