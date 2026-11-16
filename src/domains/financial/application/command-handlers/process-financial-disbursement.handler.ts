/**
 * -----------------------------------------------------------------------------
 * Financial Disbursement — Process Command Handler
 * -----------------------------------------------------------------------------
 *
 * Application orchestration for executing a Financial Account withdrawal
 * through Safaricom M-PESA B2C.
 *
 * Workflow:
 *
 * 1. Load and validate the Financial Disbursement.
 * 2. Resolve the M-PESA provider and validate its capability.
 * 3. Preflight provider configuration and callback URLs.
 * 4. Create and persist a PROCESSING attempt before provider submission.
 * 5. Submit the B2C request outside the database transaction.
 * 6. Persist provider identifiers returned in the immediate response.
 * 7. Preserve callback correlation information for FinancialModule processing.
 * 8. Preserve uncertain outcomes without automatic resubmission.
 * 9. Return the latest persisted aggregate.
 *
 * IMPORTANT:
 *
 * - This handler processes withdrawals of funds already available in
 *   Financial Accounts.
 * - It does not determine how funds became available.
 * - The B2C request does not contain OriginatorConversationID.
 * - SisiMove must not generate an application ID and pretend it was sent to
 *   Safaricom as OriginatorConversationID.
 * - Provider OriginatorConversationID, when returned by Safaricom, is stored
 *   against the Financial Disbursement Attempt and used for callback matching.
 * - An ACCEPTED response does not mean the recipient received the funds.
 * - Final success/failure is determined by the B2C result callback.
 * - FinancialModule owns callback correlation, reconciliation and financial
 *   lifecycle transitions.
 * - This handler does not directly post Financial Transactions or mutate
 *   account balances.
 * - A repeated command must never automatically submit another B2C request.
 *
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable, Logger } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ProcessFinancialDisbursementCommand } from '../commands/process-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

import { FinancialDisbursementAttemptEntity } from '../../domain/entities/financial-disbursement-attempt.entity';

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderCapabilityType } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

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

// -----------------------------------------------------------------------------
// Prepared execution
// -----------------------------------------------------------------------------

interface PreparedDisbursement {
  disbursementPublicId: typeof FinancialDisbursementAggregate.prototype.publicId;

  attemptPublicId: NonNullable<
    ReturnType<FinancialDisbursementAggregate['getLatestAttempt']>
  >['publicId'];

  providerPublicId: string;

  phoneNumber: string;

  amount: number;
}

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

    private readonly b2cService: B2CService,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // 1. Prepare and persist the attempt transactionally
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

      // -----------------------------------------------------------------------
      // Idempotency protection
      // -----------------------------------------------------------------------

      // An existing attempt means this command must not submit another B2C
      // request. This protects against event redelivery and application crashes.

      if (aggregate.hasAttempts()) {
        return null;
      }

      if (!aggregate.isPending()) {
        throw new Error(
          'Financial Disbursement must be PENDING before its first execution.',
        );
      }

      if (!aggregate.canProcess()) {
        throw new Error(
          'Financial Disbursement is not eligible for processing.',
        );
      }

      // -----------------------------------------------------------------------
      // Destination validation
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
      // Amount validation
      // -----------------------------------------------------------------------

      if (aggregate.currency.value !== 'KES') {
        throw new Error('M-PESA B2C currently supports KES withdrawals only.');
      }

      if (!aggregate.amount.isPositive()) {
        throw new Error(
          'Financial Disbursement amount must be greater than zero.',
        );
      }

      // Financial domain amounts are stored in minor units.
      // Daraja B2C expects whole KES. The B2C service performs the conversion.

      const amount = aggregate.amount.amount;

      if (!Number.isSafeInteger(amount) || amount < 100 || amount % 100 !== 0) {
        throw new Error(
          'M-PESA B2C requires a positive whole KES amount represented in minor units.',
        );
      }

      // -----------------------------------------------------------------------
      // Resolve M-PESA provider
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
      // Preflight M-PESA readiness before creating an execution attempt
      // -----------------------------------------------------------------------

      // This validates the provider configuration and callback URLs.
      // It does not obtain an OAuth token or contact Safaricom.

      await this.b2cService.validateReadiness({
        providerPublicId: provider.publicId.value,
        amount,
        phoneNumber,
        remarks: MPESA_B2C_REMARKS,
      });

      // -----------------------------------------------------------------------
      // Start parent lifecycle and create attempt
      // -----------------------------------------------------------------------

      const now = new Date();

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

      // B2C does not accept OriginatorConversationID in its request body.
      // Store the provider-issued identifier only after Safaricom returns it.

      await this.disbursementRepository.save(aggregate);

      return {
        disbursementPublicId: aggregate.publicId,
        attemptPublicId: attempt.publicId,
        providerPublicId: provider.publicId.value,
        phoneNumber,
        amount,
      };
    });

    // -------------------------------------------------------------------------
    // 2. Do not resubmit an existing attempt
    // -------------------------------------------------------------------------

    if (prepared === null) {
      this.logger.warn(
        `Financial Disbursement already has an execution attempt. No new B2C request submitted: ${command.disbursementPublicId.value}.`,
      );

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 3. Submit B2C request outside the database transaction
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
      // A thrown exception does not prove that Safaricom rejected the request.
      // The request may already have reached Safaricom.
      // Keep the attempt PROCESSING; never automatically submit it again.

      this.logger.error(
        `M-PESA B2C submission outcome is unresolved. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
        error instanceof Error ? error.stack : undefined,
      );

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 4. Persist provider response and provider-issued identifiers
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

          // An explicit provider rejection may safely fail the attempt,
          // provided it is still PROCESSING.
          // ACCEPTED and UNCERTAIN are not final outcomes.

          if (result.outcome === 'REJECTED') {
            aggregate.failAttempt(
              prepared.attemptPublicId,
              result.responseCode ?? 'MPESA_B2C_REJECTED',
              result.responseDescription ??
                'Safaricom rejected the B2C withdrawal request.',
            );
          }

          await this.disbursementRepository.save(aggregate);
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
    // 5. Preserve callback correlation information
    // -------------------------------------------------------------------------

    // FinancialModule owns callback correlation and reconciliation.
    // The M-PESA callback handler only validates and normalizes provider
    // callback payloads.
    //
    // No callback reconciliation is performed here. A callback received before
    // provider identifiers are persisted must be handled by the FinancialModule
    // callback infrastructure when that workflow is connected.

    if (result.originatorConversationId === null) {
      this.logger.warn(
        `M-PESA B2C response did not provide OriginatorConversationID. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Callback correlation remains unresolved; no automatic resubmission will occur.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Log unresolved outcomes
    // -------------------------------------------------------------------------

    if (result.outcome === 'UNCERTAIN') {
      this.logger.warn(
        `M-PESA B2C withdrawal remains unresolved. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}; Provider OriginatorConversationID: ${result.originatorConversationId ?? 'NOT RETURNED'}. No automatic resubmission will occur.`,
      );
    }

    if (result.outcome === 'ACCEPTED' && result.conversationId === null) {
      this.logger.warn(
        `M-PESA accepted the B2C request without returning a ConversationID. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation is required.`,
      );
    }

    // -------------------------------------------------------------------------
    // 7. Return the latest persisted aggregate
    // -------------------------------------------------------------------------

    return this.loadDisbursement(command);
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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialDisbursementHandler;
