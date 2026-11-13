// -----------------------------------------------------------------------------
// Financial Disbursement — Process Command Handler
// -----------------------------------------------------------------------------
//
// Application orchestration for executing a Financial Disbursement through
// Safaricom M-PESA B2C.
//
// Workflow:
//
// 1. Load and validate the Financial Disbursement.
// 2. Resolve the M-PESA provider and validate its capability.
// 3. Preflight provider configuration and callback URLs.
// 4. Create and persist a PROCESSING attempt and OriginatorConversationID.
// 5. Submit the B2C request outside the database transaction.
// 6. Persist the immediate provider response.
// 7. Reconcile callbacks that arrived before response persistence.
// 8. Preserve uncertain outcomes without automatic resubmission.
// 9. Return the latest persisted aggregate.
//
// IMPORTANT:
//
// - Only BusinessPayment is used for this SisiMove business payout workflow.
// - Journey earnings, commissions and settlements remain distinguished by
//   their SisiMove business reference metadata.
// - An ACCEPTED response does not mean the recipient received the funds.
// - Final payout success/failure is determined by the B2C result callback.
// - This handler does not post Financial Transactions or mutate account
//   balances.
// - A repeated command must never automatically submit another B2C request.
//
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';

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

import { MpesaB2CDisbursementService } from '../../../financial-payment-providers/infrastructure/mpesa/b2c/services/mpesa-b2c-disbursement.service';

import { MpesaB2CCallbackService } from '../../../financial-payment-providers/infrastructure/mpesa/b2c/services/mpesa-b2c-callback.service';

import type { MpesaB2CCommandId } from '../../../financial-payment-providers/infrastructure/mpesa/b2c/contracts/mpesa-b2c-request.interface';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MPESA_PROVIDER_CODE = 'MPESA';

const MPESA_DESTINATION_TYPE = 'MOBILE_MONEY';

const MPESA_B2C_COMMAND_ID: MpesaB2CCommandId = 'BusinessPayment';

const MPESA_B2C_REMARKS = 'SisiMove business payout';

// -----------------------------------------------------------------------------
// Prepared execution
// -----------------------------------------------------------------------------

interface PreparedDisbursement {
  disbursementPublicId: typeof FinancialDisbursementAggregate.prototype.publicId;

  attemptPublicId: NonNullable<
    ReturnType<FinancialDisbursementAggregate['getLatestAttempt']>
  >['publicId'];

  originatorConversationId: string;

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

    private readonly mpesaB2CDisbursementService: MpesaB2CDisbursementService,

    private readonly mpesaB2CCallbackService: MpesaB2CCallbackService,

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

      // A previously created attempt means this command must not submit
      // another B2C request. This also protects against event redelivery
      // after an application crash or uncertain provider response.

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
        throw new Error(
          'M-PESA B2C currently supports KES disbursements only.',
        );
      }

      if (!aggregate.amount.isPositive()) {
        throw new Error(
          'Financial Disbursement amount must be greater than zero.',
        );
      }

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

      // The M-PESA B2C disbursement service reads and validates the callback
      // URLs from MPESA_B2C_RESULT_URL and MPESA_B2C_QUEUE_TIMEOUT_URL in the
      // environment. The handler deliberately delegates provider configuration
      // to that service instead of duplicating environment-variable access.
      // These checks do not obtain an OAuth token or contact Safaricom.
      //
      // If readiness validation fails, the unit of work rolls back without
      // creating an attempt or leaving the disbursement stuck in PROCESSING.

      await this.mpesaB2CDisbursementService.validateReadiness({
        providerPublicId: provider.publicId.value,
        amount,
        phoneNumber,
        commandId: MPESA_B2C_COMMAND_ID,
        remarks: MPESA_B2C_REMARKS,
      });

      // -----------------------------------------------------------------------
      // Generate the application-owned provider correlation identifier
      // -----------------------------------------------------------------------

      // This identifier is generated once and persisted before submission.
      // It must never be regenerated when an execution outcome is uncertain.

      const originatorConversationId = randomUUID();

      // -----------------------------------------------------------------------
      // Start parent lifecycle
      // -----------------------------------------------------------------------

      const now = new Date();

      aggregate.startProcessing(
        now,
        command.correlationId,
        command.causationId,
      );

      // -----------------------------------------------------------------------
      // Create and attach attempt
      // -----------------------------------------------------------------------

      const attempt = FinancialDisbursementAttemptEntity.create(
        aggregate.id,
        FinancialProvider.create(MPESA_PROVIDER_CODE),
        aggregate.amount,
      );

      aggregate.addAttempt(attempt);

      aggregate.startAttempt(attempt.publicId, now);

      // -----------------------------------------------------------------------
      // Persist OriginatorConversationID before provider submission
      // -----------------------------------------------------------------------

      aggregate.setAttemptProviderOriginatorConversationId(
        attempt.publicId,
        originatorConversationId,
      );

      // Persist the parent and its aggregate-owned attempt atomically.
      await this.disbursementRepository.save(aggregate);

      return {
        disbursementPublicId: aggregate.publicId,
        attemptPublicId: attempt.publicId,
        originatorConversationId,
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

    let result: Awaited<ReturnType<MpesaB2CDisbursementService['submit']>>;

    try {
      result = await this.mpesaB2CDisbursementService.submit({
        providerPublicId: prepared.providerPublicId,

        originatorConversationId: prepared.originatorConversationId,

        amount: prepared.amount,

        phoneNumber: prepared.phoneNumber,

        commandId: MPESA_B2C_COMMAND_ID,

        remarks: MPESA_B2C_REMARKS,
      });
    } catch (error) {
      // A thrown exception does not prove that Safaricom rejected the request.
      // The request may already have reached Safaricom.
      //
      // Keep the attempt PROCESSING.
      // Never automatically submit another B2C request.

      this.logger.error(
        `M-PESA B2C submission outcome is unresolved. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
        error instanceof Error ? error.stack : undefined,
      );

      // A callback may have arrived before the HTTP request returned.
      await this.reconcileCallbackSafely(prepared);

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 4. Validate provider correlation
    // -------------------------------------------------------------------------

    if (result.originatorConversationId !== prepared.originatorConversationId) {
      this.logger.error(
        `M-PESA B2C response correlation mismatch. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
      );

      // Do not mutate the attempt using an unrelated response.
      // The original request outcome remains unresolved.

      await this.reconcileCallbackSafely(prepared);

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 5. Persist immediate provider response transactionally
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
        // was persisted. In that case, do not attempt to mutate a terminal
        // attempt or overwrite its callback-supplied identifiers.

        if (attempt.isProcessing() && aggregate.isProcessing()) {
          if (result.conversationId !== null) {
            aggregate.setAttemptProviderConversationId(
              prepared.attemptPublicId,
              result.conversationId,
            );
          }
          // Explicit submission rejection is different from an uncertain
          // transport failure. It is safe to fail the attempt only when it
          // remains PROCESSING.
          //
          // The parent disbursement lifecycle remains a separate workflow.

          if (result.outcome === 'REJECTED') {
            aggregate.failAttempt(
              prepared.attemptPublicId,
              result.responseCode ?? 'MPESA_B2C_REJECTED',
              result.responseDescription ??
                'Safaricom rejected the B2C disbursement request.',
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

      await this.reconcileCallbackSafely(prepared);

      return this.loadDisbursement(command);
    }

    // -------------------------------------------------------------------------
    // 6. Reconcile callbacks received before response persistence
    // -------------------------------------------------------------------------

    await this.reconcileCallbackSafely(prepared);

    // -------------------------------------------------------------------------
    // 7. Log unresolved outcomes
    // -------------------------------------------------------------------------

    if (result.outcome === 'UNCERTAIN') {
      this.logger.warn(
        `M-PESA B2C disbursement remains unresolved. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}; OriginatorConversationID: ${prepared.originatorConversationId}. No automatic resubmission will occur.`,
      );
    }

    if (result.outcome === 'ACCEPTED' && result.conversationId === null) {
      this.logger.warn(
        `M-PESA accepted the B2C request without returning a ConversationID. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation is required.`,
      );
    }

    // -------------------------------------------------------------------------
    // 8. Return the latest persisted aggregate
    // -------------------------------------------------------------------------

    return this.loadDisbursement(command);
  }

  // ===========================================================================
  // Callback Reconciliation
  // ===========================================================================

  private async reconcileCallbackSafely(
    prepared: PreparedDisbursement,
  ): Promise<void> {
    try {
      await this.mpesaB2CCallbackService.reconcilePendingCallback(
        prepared.originatorConversationId,
      );
    } catch (error) {
      this.logger.error(
        `Pending M-PESA B2C callback reconciliation failed. Disbursement: ${prepared.disbursementPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
        error instanceof Error ? error.stack : undefined,
      );
    }
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
