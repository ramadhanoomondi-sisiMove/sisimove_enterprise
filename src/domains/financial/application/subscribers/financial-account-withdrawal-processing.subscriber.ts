// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Processing Event Subscriber
// -----------------------------------------------------------------------------
//
// Application subscriber responsible for creating a Financial Disbursement
// after a Financial Account Withdrawal enters PROCESSING.
//
// Workflow:
//
// 1. Subscribe to FinancialAccountWithdrawalProcessing.
// 2. Check event idempotency.
// 3. Load the persisted withdrawal.
// 4. Verify the withdrawal belongs to the account in the event.
// 5. Recover an existing disbursement, if one was already created.
// 6. Otherwise dispatch CreateFinancialDisbursementCommand.
// 7. Link the created disbursement to the withdrawal.
// 8. Mark the event as processed.
//
// This subscriber does NOT:
//
// - Execute external payment providers.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Perform settlement or accounting.
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

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../../application/financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Application — Command
// -----------------------------------------------------------------------------

import { CreateFinancialDisbursementCommand } from '../commands/create-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Domain — Event
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalProcessingEvent } from '../../domain/events/financial-account-withdrawal-processing.event';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repositories
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialAccountWithdrawalProcessingSubscriber';

// =============================================================================
// Subscriber
// =============================================================================

@Injectable()
export class FinancialAccountWithdrawalProcessingSubscriber implements OnModuleInit {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createDisbursementHandler: CommandHandler<
      CreateFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialAccountWithdrawalProcessingEvent>(
      'FinancialAccountWithdrawalProcessing',
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(
    event: FinancialAccountWithdrawalProcessingEvent,
  ): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Check whether this event has already been processed
    // -------------------------------------------------------------------------

    if (await this.idempotencyStore.exists(CONSUMER_NAME, eventId)) {
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Load the persisted withdrawal
    // -------------------------------------------------------------------------

    const withdrawal: FinancialAccountWithdrawalAggregate | null =
      await this.withdrawalRepository.findByPublicId(event.withdrawalPublicId);

    if (withdrawal === null) {
      throw new FinancialAccountWithdrawalNotFoundException(
        event.withdrawalPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Verify account ownership
    // -------------------------------------------------------------------------

    if (withdrawal.accountPublicId.value !== event.accountPublicId.value) {
      throw new Error(
        `Withdrawal account mismatch for withdrawal ${event.withdrawalPublicId.value}`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Recover an existing disbursement
    // -------------------------------------------------------------------------
    //
    // The originating withdrawal public ID must be persisted on the
    // Financial Disbursement as a unique link.
    //
    // This handles retries where disbursement creation succeeded but saving
    // the withdrawal's disbursementPublicId did not.
    // -------------------------------------------------------------------------

    const existingDisbursement =
      await this.disbursementRepository.findByWithdrawalPublicId(
        event.withdrawalPublicId.value,
      );

    if (existingDisbursement !== null) {
      const existingPublicId = existingDisbursement.publicId.value;

      if (
        withdrawal.hasDisbursement &&
        withdrawal.disbursementPublicId !== existingPublicId
      ) {
        throw new Error(
          `Withdrawal ${event.withdrawalPublicId.value} is linked to a different disbursement`,
        );
      }

      if (!withdrawal.hasDisbursement) {
        withdrawal.setDisbursementPublicId(existingPublicId);

        await this.withdrawalRepository.save(withdrawal);
      }

      await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);

      return;
    }

    // -------------------------------------------------------------------------
    // 5. Check withdrawal link consistency
    // -------------------------------------------------------------------------

    if (withdrawal.hasDisbursement) {
      throw new Error(
        `Withdrawal ${event.withdrawalPublicId.value} has a disbursement link, but the linked disbursement could not be recovered`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Create Financial Disbursement
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // CreateFinancialDisbursementCommand constructor order:
    //
    // 1. sourceAccountPublicId
    // 2. destination
    // 3. amount
    // 4. referenceType
    // 5. referencePublicId
    // 6. correlationId
    // 7. causationId
    // 8. withdrawalPublicId
    //
    // -------------------------------------------------------------------------

    const disbursement = await this.createDisbursementHandler.execute(
      new CreateFinancialDisbursementCommand(
        withdrawal.accountPublicId,
        withdrawal.destination,
        withdrawal.amount,
        withdrawal.referenceType,
        withdrawal.referencePublicId,
        event.metadata.correlationId ?? eventId,
        event.metadata.causationId ?? eventId,
        event.withdrawalPublicId.value,
      ),
    );

    // -------------------------------------------------------------------------
    // 7. Link Disbursement to Withdrawal
    // -------------------------------------------------------------------------

    withdrawal.setDisbursementPublicId(disbursement.publicId.value);

    await this.withdrawalRepository.save(withdrawal);

    // -------------------------------------------------------------------------
    // 8. Mark Event Processed
    // -------------------------------------------------------------------------
    //
    // Only mark after disbursement creation and withdrawal linking succeed.
    //
    // If either operation fails, propagate the error so event delivery can
    // retry. A subsequent delivery can recover the disbursement using its
    // unique withdrawalPublicId.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(CONSUMER_NAME, eventId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalProcessingSubscriber;
