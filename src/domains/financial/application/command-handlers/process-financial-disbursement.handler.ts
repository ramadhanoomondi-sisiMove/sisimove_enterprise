/**
 * -----------------------------------------------------------------------------
 * Financial Disbursement — Process Command Handler
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Validate the disbursement and originating withdrawal.
 * - Resolve and validate the source Financial Account.
 * - Resolve and validate the M-PESA provider.
 * - Preflight B2C configuration and callback URLs.
 * - Atomically reserve funds and create the HOLD transaction and hold.
 * - Persist the PROCESSING attempt before contacting Safaricom.
 * - Submit B2C outside the database transaction.
 * - Persist provider-issued identifiers.
 * - Preserve uncertain outcomes without automatic resubmission.
 * - Reconcile durable M-PESA B2C callbacks and their financial consequences.
 *
 * Reservation ownership:
 * - RequestFinancialAccountWithdrawalHandler creates only the request.
 * - ProcessFinancialAccountWithdrawalHandler changes only withdrawal status.
 * - CreateFinancialDisbursementHandler creates only the disbursement.
 * - This handler owns the actual reservation immediately before B2C submission.
 *
 * Final success/failure is determined by this FinancialModule handler's
 * durable callback reconciliation.
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable, Logger } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

import { FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS } from '../financial-disbursement-callback.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../application/financial-account-hold.tokens';

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../../application/financial-account-withdrawal.tokens';

import { FINANCIAL_TRANSACTION_TOKENS } from '../../application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ProcessFinancialDisbursementCommand } from '../commands/process-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import type { FinancialAccountHoldRepository } from '../../domain/repositories/financial-account-hold.repository';

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

import type {
  FinancialDisbursementCallbackRepository,
  FinancialDisbursementCallbackRecord,
} from '../../../financial-payment-providers/domain/repositories/financial-disbursement-callback.repository';

// -----------------------------------------------------------------------------
// Aggregates and Entities
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

import { FinancialDisbursementAttemptEntity } from '../../domain/entities/financial-disbursement-attempt.entity';

import { FinancialAccountHoldAggregate } from '../../domain/aggregates/financial-account-hold.aggregate';

import { FinancialAccountHoldEntity } from '../../domain/entities/financial-account-hold.entity';

import { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderCapabilityType } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

import { FinancialAccountWithdrawalPublicId } from '../../domain/value-objects/financial-account-withdrawal-public-id.vo';

import { FinancialHoldReference } from '../../domain/value-objects/financial-hold-reference.vo';

import { FinancialAccountHeldAmount } from '../../domain/value-objects/financial-account-held-amount.vo';

import {
  FinancialAccountReference,
  FinancialBalanceType,
  FinancialDisbursementAttemptPublicId,
  FinancialDisbursementPublicId,
  FinancialTransactionEntryType,
  FinancialTransactionReference,
  FinancialTransactionType,
  Money,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// M-PESA B2C
// -----------------------------------------------------------------------------

import { B2CService } from '../../../../mpesa/b2c/b2c.service';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MPESA_PROVIDER_CODE = 'MPESA';

const MPESA_DESTINATION_TYPE = 'MOBILE_MONEY';

const MPESA_B2C_REMARKS = 'SisiMove Financial Account withdrawal';

const WITHDRAWAL_HOLD_REFERENCE_TYPE = 'FINANCIAL_ACCOUNT_WITHDRAWAL';

const WITHDRAWAL_HOLD_TRANSACTION_REFERENCE_TYPE =
  'FINANCIAL_ACCOUNT_WITHDRAWAL_HOLD';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class ProcessFinancialDisbursementHandler implements CommandHandler<
  ProcessFinancialDisbursementCommand,
  FinancialDisbursementAggregate
> {
  private readonly logger = new Logger(
    ProcessFinancialDisbursementHandler.name,
  );

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY)
    private readonly holdRepository: FinancialAccountHoldRepository,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly withdrawalRepository: FinancialAccountWithdrawalRepository,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly transactionRepository: FinancialTransactionRepository,

    private readonly b2cService: B2CService,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,

    @Inject(FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialDisbursementCallbackRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // 1. Validate and prepare the reservation and attempt atomically.
    // -------------------------------------------------------------------------

    const prepared = await this.unitOfWork.execute(async () => {
      const aggregate = await this.disbursementRepository.findByPublicId(
        command.disbursementPublicId,
      );

      if (aggregate === null) {
        throw new Error(
          `Financial Disbursement "${command.disbursementPublicId.value}" was not found.`,
        );
      }

      // An existing attempt means processing has already started.
      // Never submit another B2C request automatically.

      if (aggregate.hasAttempts()) {
        return null;
      }

      if (!aggregate.isPending() || !aggregate.canProcess()) {
        throw new Error(
          'Financial Disbursement is not eligible for processing.',
        );
      }

      // -----------------------------------------------------------------------
      // Resolve originating withdrawal.
      // -----------------------------------------------------------------------

      const withdrawalPublicId = aggregate.disbursement.withdrawalPublicId;

      if (
        withdrawalPublicId === undefined ||
        withdrawalPublicId.trim().length === 0
      ) {
        throw new Error(
          `Disbursement "${aggregate.publicId.value}" has no originating withdrawal.`,
        );
      }

      const withdrawal = await this.withdrawalRepository.findByPublicId(
        new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
      );

      if (withdrawal === null) {
        throw new Error(
          `Originating withdrawal "${withdrawalPublicId}" was not found.`,
        );
      }

      if (withdrawal.disbursementPublicId !== aggregate.publicId.value) {
        throw new Error(
          'The originating withdrawal does not reference this disbursement.',
        );
      }

      const amount = aggregate.amount.amount;
      const currency = aggregate.amount.currency;

      if (
        withdrawal.amountValue !== amount ||
        withdrawal.currency !== currency.value
      ) {
        throw new Error(
          'Withdrawal amount or currency does not match the disbursement.',
        );
      }

      if (
        withdrawal.accountPublicId.value !==
        aggregate.sourceAccountPublicId.value
      ) {
        throw new Error(
          'Withdrawal account does not match the disbursement source account.',
        );
      }

      if (!withdrawal.isProcessing) {
        throw new Error(
          `Withdrawal "${withdrawal.publicId.value}" is not PROCESSING.`,
        );
      }

      // -----------------------------------------------------------------------
      // Validate amount and currency.
      // -----------------------------------------------------------------------

      if (!aggregate.amount.isPositive()) {
        throw new Error(
          'Financial Disbursement amount must be greater than zero.',
        );
      }

      if (currency.value !== 'KES') {
        throw new Error('M-PESA B2C currently supports KES withdrawals only.');
      }

      // Financial domain amounts use minor units.
      // B2CService converts the amount to whole KES for Daraja.

      if (!Number.isSafeInteger(amount) || amount < 100 || amount % 100 !== 0) {
        throw new Error(
          'M-PESA B2C requires a positive whole KES amount represented in minor units.',
        );
      }

      // -----------------------------------------------------------------------
      // Resolve source Financial Account.
      // -----------------------------------------------------------------------

      const customerAccount = await this.accountRepository.findByPublicId(
        aggregate.sourceAccountPublicId,
      );

      if (customerAccount === null) {
        throw new Error(
          `Source Financial Account "${aggregate.sourceAccountPublicId.value}" was not found.`,
        );
      }

      customerAccount.ensureOperational();
      customerAccount.ensureCurrency(currency);

      if (customerAccount.ownerPublicId === undefined) {
        throw new Error(
          'The source Financial Account has no owner public identity.',
        );
      }

      const now = new Date();

      // -----------------------------------------------------------------------
      // Validate M-PESA destination.
      // -----------------------------------------------------------------------

      if (aggregate.destinationType !== MPESA_DESTINATION_TYPE) {
        throw new Error(
          `M-PESA B2C does not support destination type "${aggregate.destinationType}".`,
        );
      }

      const phoneNumber = aggregate.destinationValue.trim();

      if (!phoneNumber) {
        throw new Error(
          'Financial Disbursement destination phone number is missing.',
        );
      }

      // -----------------------------------------------------------------------
      // Resolve M-PESA provider.
      // -----------------------------------------------------------------------

      const provider = await this.providerRepository.findByCode(
        FinancialPaymentProviderCode.create(MPESA_PROVIDER_CODE),
      );

      if (provider === null) {
        throw new Error(
          'The configured M-PESA payment provider could not be found.',
        );
      }

      provider.ensureCanPerform(
        FinancialPaymentProviderCapabilityType.create('INITIATE_DISBURSEMENT'),
      );

      // -----------------------------------------------------------------------
      // Preflight B2C readiness before reserving funds.
      // -----------------------------------------------------------------------

      await this.b2cService.validateReadiness({
        providerPublicId: provider.publicId.value,
        amount,
        phoneNumber,
        remarks: MPESA_B2C_REMARKS,
      });

      // -----------------------------------------------------------------------
      // Protect against duplicate reservations.
      // -----------------------------------------------------------------------

      const holdReference = FinancialHoldReference.create(
        WITHDRAWAL_HOLD_REFERENCE_TYPE,
        withdrawal.publicId.value,
      );

      const existingHolds =
        await this.holdRepository.findByReference(holdReference);

      if (existingHolds.length > 0) {
        throw new Error(
          `A Financial Account Hold already exists for withdrawal "${withdrawal.publicId.value}".`,
        );
      }

      // -----------------------------------------------------------------------
      // Reserve funds: AVAILABLE -> HELD.
      // -----------------------------------------------------------------------

      customerAccount.holdFunds(amount, currency, now);

      // -----------------------------------------------------------------------
      // Build Financial Account reference.
      // -----------------------------------------------------------------------

      const accountReference = FinancialAccountReference.create(
        customerAccount.type.value,
        customerAccount.ownerPublicId.value,
      );

      // -----------------------------------------------------------------------
      // Create and complete HOLD Financial Transaction.
      // -----------------------------------------------------------------------

      const transactionReference = FinancialTransactionReference.create(
        WITHDRAWAL_HOLD_TRANSACTION_REFERENCE_TYPE,
        withdrawal.publicId.value,
      );

      const transactionAmount = Money.create(amount, currency);

      const transaction = FinancialTransactionAggregate.create(
        {
          type: FinancialTransactionType.create('HOLD'),
          amount: transactionAmount,
          reference: transactionReference,
        },
        command.correlationId,
        now,
      );

      // AVAILABLE is debited.

      transaction.addEntry(
        {
          account: accountReference,
          type: FinancialTransactionEntryType.create('DEBIT'),
          balanceType: FinancialBalanceType.create('AVAILABLE'),
          amount: Money.create(amount, currency),
        },
        now,
      );

      // HELD is credited.

      transaction.addEntry(
        {
          account: accountReference,
          type: FinancialTransactionEntryType.create('CREDIT'),
          balanceType: FinancialBalanceType.create('HELD'),
          amount: Money.create(amount, currency),
        },
        now,
      );

      transaction.complete(command.correlationId, now);

      // -----------------------------------------------------------------------
      // Create Financial Account Hold and link HOLD transaction.
      // -----------------------------------------------------------------------

      const holdEntity = FinancialAccountHoldEntity.create(
        customerAccount.id,
        customerAccount.publicId,
        FinancialAccountHeldAmount.create(amount),
        currency.value,
        holdReference,
      );

      const hold = FinancialAccountHoldAggregate.create(holdEntity);

      hold.setHoldTransactionPublicId(transaction.publicId.value);

      hold.recordCreated(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // Start disbursement and create attempt.
      // -----------------------------------------------------------------------

      aggregate.startProcessing(
        now,
        command.correlationId,
        command.causationId,
      );

      const attempt = FinancialDisbursementAttemptEntity.create(
        aggregate.id,
        FinancialProvider.create(MPESA_PROVIDER_CODE),
        aggregate.amount,
      );

      aggregate.addAttempt(attempt);
      aggregate.startAttempt(attempt.publicId, now);

      // -----------------------------------------------------------------------
      // Persist every reservation change in the SAME UnitOfWork.
      // -----------------------------------------------------------------------

      await this.transactionRepository.save(transaction);

      await this.holdRepository.create(hold);

      await this.accountRepository.save(customerAccount);

      await this.disbursementRepository.save(aggregate);

      // Publish events only after all aggregate changes have been persisted
      // within this UnitOfWork.

      const accountEvents = customerAccount.pullDomainEvents();
      const transactionEvents = transaction.pullDomainEvents();
      const holdEvents = hold.pullDomainEvents();
      const disbursementEvents = aggregate.pullDomainEvents();

      const events = [
        ...accountEvents,
        ...transactionEvents,
        ...holdEvents,
        ...disbursementEvents,
      ];

      if (events.length > 0) {
        await this.eventPublisher.publishAll(events);
      }

      return {
        disbursementPublicId: aggregate.publicId,
        attemptPublicId: attempt.publicId,
        providerPublicId: provider.publicId.value,
        phoneNumber,
        amount,
      };
    });

    // -------------------------------------------------------------------------
    // 2. Do not resubmit an existing attempt.
    // -------------------------------------------------------------------------

    if (prepared === null) {
      this.logger.warn(
        `Financial Disbursement already has an execution attempt. No new B2C request submitted: ${command.disbursementPublicId.value}.`,
      );

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 3. Submit B2C outside the database transaction.
    // -------------------------------------------------------------------------

    let result: Awaited<ReturnType<B2CService['submit']>>;

    try {
      result = await this.b2cService.submit({
        providerPublicId: prepared.providerPublicId,
        amount: prepared.amount,
        phoneNumber: prepared.phoneNumber,
        remarks: MPESA_B2C_REMARKS,
      });
    } catch (error) {
      // The request may have reached Safaricom.
      // Do not release the hold or submit again automatically.

      this.logger.error(
        `M-PESA B2C submission outcome is unresolved. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. The reservation remains in place for reconciliation.`,
        error instanceof Error ? error.stack : undefined,
      );

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 4. Persist provider response and identifiers.
    // -------------------------------------------------------------------------

    try {
      await this.unitOfWork.execute(async () => {
        const aggregate = await this.disbursementRepository.findByPublicId(
          prepared.disbursementPublicId,
        );

        if (aggregate === null) {
          throw new Error(
            `Financial Disbursement "${prepared.disbursementPublicId.value}" was not found while persisting the provider response.`,
          );
        }

        const attempt = aggregate.getAttempt(prepared.attemptPublicId);

        if (attempt === undefined) {
          throw new Error(
            'The Financial Disbursement Attempt could not be found.',
          );
        }

        // A callback may have completed the attempt before this HTTP response
        // was persisted. Never overwrite a terminal attempt.

        if (attempt.isProcessing() && aggregate.isProcessing()) {
          if (result.originatorConversationId !== null) {
            aggregate.setAttemptProviderOriginatorConversationId(
              prepared.attemptPublicId,
              result.originatorConversationId,
            );
          }

          if (result.conversationId !== null) {
            aggregate.setAttemptProviderConversationId(
              prepared.attemptPublicId,
              result.conversationId,
            );
          }

          // ACCEPTED and UNCERTAIN are not final outcomes.
          // REJECTED must be passed through the FinancialModule's coordinated
          // failure and reservation-release workflow.

          await this.disbursementRepository.save(aggregate);

          const events = aggregate.pullDomainEvents();

          if (events.length > 0) {
            await this.eventPublisher.publishAll(events);
          }
        }
      });
    } catch (error) {
      // Safaricom may have accepted the request even if local persistence
      // failed. Never submit it again automatically.

      this.logger.error(
        `M-PESA B2C response could not be fully persisted. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation is required.`,
        error instanceof Error ? error.stack : undefined,
      );

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 5. Process definitive rejection and log unresolved outcomes.
    // -------------------------------------------------------------------------

    if (result.outcome === 'REJECTED') {
      this.logger.error(
        `M-PESA rejected the B2C submission. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}; Code: ${result.responseCode ?? 'NOT PROVIDED'}; Description: ${result.responseDescription ?? 'NOT PROVIDED'}. Starting confirmed-failure recovery.`,
      );

      // A definitive provider rejection means the payout was not accepted.
      // Recover the reservation through this handler's existing workflow.
      //
      // This is deliberately outside the previous UnitOfWork because
      // processConfirmedFailure() owns its own atomic financial transaction.
      //
      // If a callback has already changed the attempt to a terminal state,
      // recovery must not overwrite that state.

      await this.processConfirmedFailure(
        prepared.disbursementPublicId,
        prepared.attemptPublicId,
        result.responseCode ?? 'B2C_REJECTED',
        result.responseDescription ??
          'Safaricom rejected the B2C withdrawal request.',
        command.correlationId,
        command.causationId,
      );

      return this.loadDisbursement(command);
    }

    if (result.originatorConversationId === null) {
      this.logger.warn(
        `M-PESA B2C response did not provide OriginatorConversationID. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation may be required.`,
      );
    }

    if (result.outcome === 'UNCERTAIN') {
      this.logger.warn(
        `M-PESA B2C withdrawal remains unresolved. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}; Provider OriginatorConversationID: ${result.originatorConversationId ?? 'NOT RETURNED'}. The reservation remains in place.`,
      );
    }

    if (result.outcome === 'ACCEPTED' && result.conversationId === null) {
      this.logger.warn(
        `M-PESA accepted the B2C request without returning a ConversationID. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation is required.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Return latest persisted aggregate.
    // -------------------------------------------------------------------------

    return this.loadDisbursement(command);
  }

  /**
   * Coordinates recovery after a definitive M-PESA B2C failure.
   *
   * This method is intentionally part of ProcessFinancialDisbursementHandler.
   * It must only be called for a definitive failure, never for a timeout,
   * transport exception, or uncertain provider outcome.
   */
  public async processConfirmedFailure(
    disbursementPublicId: FinancialDisbursementPublicId,
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    failureCode: string,
    failureMessage: string,
    correlationId: string,
    causationId?: string,
  ): Promise<FinancialDisbursementAggregate> {
    return this.unitOfWork.execute(() =>
      this.processConfirmedFailureWithinUnitOfWork(
        disbursementPublicId,
        attemptPublicId,
        failureCode,
        failureMessage,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Performs confirmed-failure recovery in the caller's UnitOfWork.
   *
   * Callback reconciliation uses this method so the reservation release,
   * withdrawal/disbursement failure, and callback PROCESSED transition commit
   * or roll back together. This method deliberately does not open a nested
   * UnitOfWork.
   */
  private async processConfirmedFailureWithinUnitOfWork(
    disbursementPublicId: FinancialDisbursementPublicId,
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    failureCode: string,
    failureMessage: string,
    correlationId: string,
    causationId?: string,
    conversationId?: string,
  ): Promise<FinancialDisbursementAggregate> {
    const now = new Date();

    const aggregate =
      await this.disbursementRepository.findByPublicId(disbursementPublicId);

    if (aggregate === null) {
      throw new Error(
        `Financial Disbursement "${disbursementPublicId.value}" was not found.`,
      );
    }

    // Do not perform a second recovery.
    if (aggregate.isFailed()) {
      return aggregate;
    }

    if (!aggregate.isProcessing()) {
      throw new Error(
        'Only a PROCESSING disbursement can undergo confirmed-failure recovery.',
      );
    }

    const attempt = aggregate.getAttempt(attemptPublicId);

    if (attempt === undefined) {
      throw new Error(
        'The execution attempt does not belong to this disbursement.',
      );
    }

    if (!attempt.isProcessing()) {
      throw new Error(
        'Only a PROCESSING attempt can undergo confirmed-failure recovery.',
      );
    }

    const withdrawalPublicId = aggregate.disbursement.withdrawalPublicId;

    if (
      withdrawalPublicId === undefined ||
      withdrawalPublicId.trim().length === 0
    ) {
      throw new Error('The originating withdrawal public ID is missing.');
    }

    const withdrawal = await this.withdrawalRepository.findByPublicId(
      new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
    );

    if (withdrawal === null || !withdrawal.isProcessing) {
      throw new Error(
        'The originating withdrawal is missing or is not PROCESSING.',
      );
    }

    const account = await this.accountRepository.findByPublicId(
      aggregate.sourceAccountPublicId,
    );

    if (account === null) {
      throw new Error('The source Financial Account could not be found.');
    }

    if (account.ownerPublicId === undefined) {
      throw new Error(
        'The source Financial Account has no owner public identity.',
      );
    }

    const amount = aggregate.amount.amount;
    const currency = aggregate.amount.currency;

    const holdReference = FinancialHoldReference.create(
      WITHDRAWAL_HOLD_REFERENCE_TYPE,
      withdrawal.publicId.value,
    );

    const activeHolds =
      await this.holdRepository.findActiveByReference(holdReference);

    if (activeHolds.length !== 1) {
      throw new Error(
        `Expected exactly one active withdrawal hold; found ${activeHolds.length}. Recovery stopped for reconciliation.`,
      );
    }

    const hold = activeHolds[0];

    if (hold === undefined) {
      throw new Error(
        'The active withdrawal hold could not be resolved. Recovery stopped for reconciliation.',
      );
    }

    if (
      !hold.isActive ||
      hold.accountPublicId.value !== account.publicId.value ||
      hold.amountValue !== amount ||
      hold.currency !== currency.value
    ) {
      throw new Error(
        'The active hold does not match the withdrawal and disbursement.',
      );
    }

    // Preserve the provider ConversationID when it arrived with the callback.
    if (conversationId !== undefined) {
      aggregate.setAttemptProviderConversationId(
        attemptPublicId,
        conversationId,
      );
    }

    // 1. Mark the provider attempt as definitively failed.
    aggregate.failAttempt(attemptPublicId, failureCode, failureMessage, now);

    // 2. Restore the reserved amount: HELD -> AVAILABLE.
    account.releaseHeldFunds(amount, currency, now);

    const accountReference = FinancialAccountReference.create(
      account.type.value,
      account.ownerPublicId.value,
    );

    // 3. Create the balanced RELEASE transaction.
    const releaseReference = FinancialTransactionReference.create(
      'FINANCIAL_ACCOUNT_WITHDRAWAL_RELEASE',
      withdrawal.publicId.value,
    );

    const releaseTransaction = FinancialTransactionAggregate.create(
      {
        type: FinancialTransactionType.create('RELEASE'),
        amount: Money.create(amount, currency),
        reference: releaseReference,
      },
      correlationId,
      now,
    );

    releaseTransaction.addEntry(
      {
        account: accountReference,
        type: FinancialTransactionEntryType.create('DEBIT'),
        balanceType: FinancialBalanceType.create('HELD'),
        amount: Money.create(amount, currency),
      },
      now,
    );

    releaseTransaction.addEntry(
      {
        account: accountReference,
        type: FinancialTransactionEntryType.create('CREDIT'),
        balanceType: FinancialBalanceType.create('AVAILABLE'),
        amount: Money.create(amount, currency),
      },
      now,
    );

    releaseTransaction.complete(correlationId, now);

    // 4. Resolve the hold through the RELEASE transaction.
    hold.release(
      releaseTransaction.publicId.value,
      now,
      correlationId,
      causationId,
    );

    // 5. Fail the originating withdrawal.
    withdrawal.fail(failureMessage, now, correlationId, causationId);

    // 6. Fail the parent disbursement.
    aggregate.fail(failureMessage, now, correlationId, causationId);

    // 7. Persist all changes inside the caller's UnitOfWork.
    await this.transactionRepository.save(releaseTransaction);
    await this.accountRepository.save(account);
    await this.holdRepository.save(hold);
    await this.withdrawalRepository.save(withdrawal);
    await this.disbursementRepository.save(aggregate);

    // 8. Publish domain events within the same UnitOfWork.
    const events = [
      ...account.pullDomainEvents(),
      ...releaseTransaction.pullDomainEvents(),
      ...hold.pullDomainEvents(),
      ...withdrawal.pullDomainEvents(),
      ...aggregate.pullDomainEvents(),
    ];

    if (events.length > 0) {
      await this.eventPublisher.publishAll(events);
    }

    this.logger.warn(
      `Confirmed B2C failure recovered. Disbursement: ${aggregate.publicId.value}; Withdrawal: ${withdrawal.publicId.value}; Amount: ${amount} ${currency.value}.`,
    );

    return aggregate;
  }

  // ==========================================================================
  // Pending Callback Reconciliation
  // ==========================================================================

  /**
   * Processes a bounded batch of durable M-PESA B2C callbacks.
   *
   * Unmatched callbacks remain PENDING for a later reconciliation pass. A
   * queue-timeout callback is informational only and never releases a hold.
   * Each callback and its financial consequences are handled in one UoW.
   */
  public async processPendingCallbacks(limit = 50): Promise<number> {
    const pendingCallbacks = await this.callbackRepository.findPending(limit);
    let processedCount = 0;

    for (const pendingCallback of pendingCallbacks) {
      try {
        const processed = await this.unitOfWork.execute(() =>
          this.processCallbackWithinUnitOfWork(pendingCallback),
        );

        if (processed) {
          processedCount += 1;
        }
      } catch (error) {
        // Keep transient or unresolved callbacks PENDING. A later pass can
        // retry after provider identifiers or related financial records land.
        this.logger.error(
          `M-PESA B2C callback reconciliation failed. Callback: ${pendingCallback.publicId}; OriginatorConversationID: ${pendingCallback.originatorConversationId}. Callback remains pending for reconciliation.`,
          error instanceof Error ? error.stack : undefined,
        );
      }
    }

    return processedCount;
  }

  /**
   * Re-reads and reconciles one callback within an already-open UnitOfWork.
   */
  private async processCallbackWithinUnitOfWork(
    pendingCallback: FinancialDisbursementCallbackRecord,
  ): Promise<boolean> {
    const callback =
      await this.callbackRepository.findByProviderOriginatorConversationId(
        pendingCallback.provider,
        pendingCallback.originatorConversationId,
        pendingCallback.type,
      );

    if (callback === null || callback.status !== 'PENDING') {
      return false;
    }

    // This handler currently owns M-PESA B2C disbursement reconciliation.
    if (callback.provider !== MPESA_PROVIDER_CODE) {
      return false;
    }

    const aggregate =
      await this.disbursementRepository.findByProviderOriginatorConversationId(
        FinancialProvider.create(MPESA_PROVIDER_CODE),
        callback.originatorConversationId,
      );

    // Do not fail or consume an unmatched callback. The provider response may
    // arrive before the submission response identifiers are persisted.
    if (aggregate === null) {
      return false;
    }

    const attempt = aggregate.attempts.find(
      (candidate) =>
        candidate.provider.value === MPESA_PROVIDER_CODE &&
        candidate.providerOriginatorConversationId ===
          callback.originatorConversationId,
    );

    if (attempt === undefined) {
      return false;
    }

    const now = new Date();
    const correlationId = callback.publicId;
    const causationId = callback.publicId;

    if (callback.type === 'QUEUE_TIMEOUT') {
      // A queue timeout cannot determine the provider-side financial result.
      // Link and consume this informational callback, retaining the hold.
      const marked = await this.callbackRepository.markProcessed(
        callback.id,
        attempt.id.value,
        now,
      );

      if (!marked) {
        throw new Error(
          `Callback "${callback.publicId}" was concurrently processed or changed state.`,
        );
      }

      this.logger.warn(
        `M-PESA B2C queue timeout recorded without changing financial state. Disbursement: ${aggregate.publicId.value}; Attempt: ${attempt.publicId.value}; Callback: ${callback.publicId}.`,
      );

      return true;
    }

    // A final result can only be applied to a currently processing attempt.
    if (!aggregate.isProcessing() || !attempt.isProcessing()) {
      return false;
    }

    if (callback.resultCode === null) {
      const markedFailed = await this.callbackRepository.markFailed(
        callback.id,
      );

      if (!markedFailed) {
        throw new Error(
          `Malformed callback "${callback.publicId}" could not be marked FAILED.`,
        );
      }

      this.logger.error(
        `Malformed M-PESA B2C result callback marked FAILED because ResultCode is missing. Callback: ${callback.publicId}.`,
      );

      return true;
    }

    if (callback.resultCode === 0) {
      if (callback.transactionId === null) {
        const markedFailed = await this.callbackRepository.markFailed(
          callback.id,
        );

        if (!markedFailed) {
          throw new Error(
            `Malformed callback "${callback.publicId}" could not be marked FAILED.`,
          );
        }

        this.logger.error(
          `Malformed M-PESA B2C success callback marked FAILED because TransactionID is missing. Callback: ${callback.publicId}.`,
        );

        return true;
      }

      if (callback.conversationId !== null) {
        aggregate.setAttemptProviderConversationId(
          attempt.publicId,
          callback.conversationId,
        );
      }

      aggregate.setAttemptProviderTransactionId(
        attempt.publicId,
        callback.transactionId,
      );

      aggregate.succeedAttempt(
        attempt.publicId,
        now,
        correlationId,
        causationId,
      );

      await this.disbursementRepository.save(aggregate);

      const events = aggregate.pullDomainEvents();

      if (events.length > 0) {
        await this.eventPublisher.publishAll(events);
      }
    } else {
      await this.processConfirmedFailureWithinUnitOfWork(
        aggregate.publicId,
        attempt.publicId,
        `MPESA_B2C_${callback.resultCode}`,
        callback.resultDesc ?? 'Safaricom reported a failed B2C disbursement.',
        correlationId,
        causationId,
        callback.conversationId ?? undefined,
      );
    }

    // This conditional transition is deliberately last. If another worker
    // already processed the callback, throwing rolls back the aggregate and
    // financial changes in this same UnitOfWork.
    const marked = await this.callbackRepository.markProcessed(
      callback.id,
      attempt.id.value,
      now,
    );

    if (!marked) {
      throw new Error(
        `Callback "${callback.publicId}" was concurrently processed or changed state.`,
      );
    }

    this.logger.log(
      `M-PESA B2C result callback reconciled. Type: ${callback.type}; ResultCode: ${callback.resultCode}; Disbursement: ${aggregate.publicId.value}; Attempt: ${attempt.publicId.value}; Callback: ${callback.publicId}.`,
    );

    return true;
  }

  // ===========================================================================
  // Reload Disbursement
  // ===========================================================================

  private async loadDisbursement(
    command: ProcessFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    return this.unitOfWork.execute(async () => {
      const aggregate = await this.disbursementRepository.findByPublicId(
        command.disbursementPublicId,
      );

      if (aggregate === null) {
        throw new Error(
          `Financial Disbursement "${command.disbursementPublicId.value}" was not found.`,
        );
      }

      return aggregate;
    });
  }
}

export default ProcessFinancialDisbursementHandler;
