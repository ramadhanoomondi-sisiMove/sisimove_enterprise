// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Processing Event Subscriber
// -----------------------------------------------------------------------------

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { EventBus } from '../../../../infrastructure/events/event-bus';

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../../application/financial-disbursement.tokens';

import { CreateFinancialDisbursementCommand } from '../commands/create-financial-disbursement.command';

import { FinancialAccountWithdrawalProcessingEvent } from '../../domain/events/financial-account-withdrawal-processing.event';

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

import { FinancialAccountWithdrawalNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialAccountWithdrawalProcessingSubscriber';

const EVENT_NAME = 'FinancialAccountWithdrawalProcessing';

const CLAIM_LEASE_DURATION_MS = 120_000;

// =============================================================================
// Subscriber
// =============================================================================

@Injectable()
export class FinancialAccountWithdrawalProcessingSubscriber implements OnModuleInit {
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
      EVENT_NAME,
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
    // 1. Validate Event Identity
    // -------------------------------------------------------------------------

    if (!eventId) {
      throw new Error(
        'FinancialAccountWithdrawalProcessingEvent has no event ID.',
      );
    }

    if (!event.withdrawalPublicId) {
      throw new Error(
        'FinancialAccountWithdrawalProcessingEvent has no withdrawal public ID.',
      );
    }

    if (!event.accountPublicId) {
      throw new Error(
        'FinancialAccountWithdrawalProcessingEvent has no account public ID.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Acquire an Exclusive Processing Claim
    // -------------------------------------------------------------------------

    const claimToken = await this.idempotencyStore.acquireClaim(
      CONSUMER_NAME,
      eventId,
      CLAIM_LEASE_DURATION_MS,
    );

    if (claimToken === null) {
      // A null claim can mean either:
      // - this event was already processed; or
      // - another worker currently owns the active claim.
      //
      // Distinguish these cases instead of silently acknowledging both.

      const alreadyProcessed = await this.idempotencyStore.exists(
        CONSUMER_NAME,
        eventId,
      );

      if (alreadyProcessed) {
        return;
      }

      // Another worker owns the active claim. Propagate an error so the
      // event delivery mechanism can retry instead of dropping this event.
      throw new Error(
        `FinancialAccountWithdrawalProcessingEvent ${eventId} is currently being processed by another worker.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load the Persisted Withdrawal
    // -------------------------------------------------------------------------

    const withdrawal = await this.withdrawalRepository.findByPublicId(
      event.withdrawalPublicId,
    );

    if (withdrawal === null) {
      throw new FinancialAccountWithdrawalNotFoundException(
        event.withdrawalPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Verify Account Ownership
    // -------------------------------------------------------------------------

    if (withdrawal.accountPublicId.value !== event.accountPublicId.value) {
      throw new Error(
        `Withdrawal account mismatch for withdrawal ${event.withdrawalPublicId.value}`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Recover an Existing Disbursement
    // -------------------------------------------------------------------------
    //
    // Recovery must happen before checking withdrawal.isProcessing.
    //
    // A disbursement may have been created successfully before the withdrawal
    // moved to another state or before the previous worker completed linking.
    // We must recover that disbursement rather than create another one.
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

      await this.ensureDisbursementLinked(
        event.withdrawalPublicId,
        existingPublicId,
      );

      await this.idempotencyStore.markProcessed(
        CONSUMER_NAME,
        eventId,
        claimToken,
      );

      return;
    }

    // -------------------------------------------------------------------------
    // 6. Check Withdrawal Link Consistency
    // -------------------------------------------------------------------------

    if (withdrawal.hasDisbursement) {
      throw new Error(
        `Withdrawal ${event.withdrawalPublicId.value} has a disbursement link, but the linked disbursement could not be recovered`,
      );
    }

    // -------------------------------------------------------------------------
    // 7. Verify Withdrawal Is Still PROCESSING
    // -------------------------------------------------------------------------
    //
    // Never create a new disbursement for a withdrawal that has already
    // moved out of PROCESSING.
    //
    // If the withdrawal has moved to another state before a disbursement
    // exists, this processing event is no longer actionable.
    // -------------------------------------------------------------------------

    if (!withdrawal.isProcessing) {
      await this.idempotencyStore.markProcessed(
        CONSUMER_NAME,
        eventId,
        claimToken,
      );

      return;
    }

    // -------------------------------------------------------------------------
    // 8. Create Financial Disbursement
    // -------------------------------------------------------------------------
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
    // 9. Atomically Link Disbursement to Withdrawal
    // -------------------------------------------------------------------------

    await this.ensureDisbursementLinked(
      event.withdrawalPublicId,
      disbursement.publicId.value,
    );

    // -------------------------------------------------------------------------
    // 10. Mark Event as Processed
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(
      CONSUMER_NAME,
      eventId,
      claimToken,
    );
  }

  // ===========================================================================
  // Ensure Disbursement Link
  // ===========================================================================

  private async ensureDisbursementLinked(
    withdrawalPublicId: Parameters<
      FinancialAccountWithdrawalRepository['linkDisbursementIfProcessing']
    >[0],
    disbursementPublicId: string,
  ): Promise<void> {
    const linked = await this.withdrawalRepository.linkDisbursementIfProcessing(
      withdrawalPublicId,
      disbursementPublicId,
    );

    if (linked) {
      return;
    }

    const latestWithdrawal =
      await this.withdrawalRepository.findByPublicId(withdrawalPublicId);

    if (latestWithdrawal === null) {
      throw new FinancialAccountWithdrawalNotFoundException(
        withdrawalPublicId.value,
      );
    }

    if (
      latestWithdrawal.hasDisbursement &&
      latestWithdrawal.disbursementPublicId !== disbursementPublicId
    ) {
      throw new Error(
        `Withdrawal ${withdrawalPublicId.value} is already linked to a different disbursement`,
      );
    }

    // The same link may already have been persisted by another execution.
    // This remains safe even if the withdrawal has since left PROCESSING.
    if (
      latestWithdrawal.hasDisbursement &&
      latestWithdrawal.disbursementPublicId === disbursementPublicId
    ) {
      return;
    }

    throw new Error(
      `Unable to link disbursement ${disbursementPublicId} to withdrawal ${withdrawalPublicId.value}. The withdrawal is no longer eligible for linking or its state changed concurrently.`,
    );
  }
}

export default FinancialAccountWithdrawalProcessingSubscriber;
