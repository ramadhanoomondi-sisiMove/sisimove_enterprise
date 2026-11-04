// -----------------------------------------------------------------------------
// Financial Payment — Process Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable, Logger } from '@nestjs/common';

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';
import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';
import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

import { FinancialPaymentAttemptEntity } from '../../domain/entities/financial-payment-attempt.entity';

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';
import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';
import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';
import { FinancialProviderReference } from '../../domain/value-objects/financial-provider-reference.vo';
import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';
import { FinancialPaymentProviderCapabilityType } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

import { MpesaStkPushService } from '../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-stk-push.service';
import { MpesaCallbackService } from '../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-callback.service';

import type { MpesaStkPushResult } from '../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-stk-push.types';

import { FinancialPaymentNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ProcessFinancialPaymentHandler implements CommandHandler<
  ProcessFinancialPaymentCommand,
  FinancialPaymentAggregate
> {
  private readonly logger = new Logger(ProcessFinancialPaymentHandler.name);

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly paymentRepository: FinancialPaymentRepository,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly paymentMethodRepository: FinancialPaymentMethodRepository,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly mpesaStkPushService: MpesaStkPushService,

    private readonly mpesaCallbackService: MpesaCallbackService,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialPaymentCommand,
  ): Promise<FinancialPaymentAggregate> {
    // -------------------------------------------------------------------------
    // 1. Prepare and persist the attempt transactionally
    // -------------------------------------------------------------------------

    const prepared = await this.unitOfWork.execute(async () => {
      const aggregate = await this.paymentRepository.findByPublicId(
        command.paymentPublicId,
      );

      if (aggregate === null) {
        throw new FinancialPaymentNotFoundException(
          command.paymentPublicId.value,
        );
      }

      // Never create another provider attempt while an earlier attempt
      // remains active or the payment has already reached a terminal state.
      if (!aggregate.canCreateAttempt()) {
        throw new Error(
          'Financial Payment cannot create another provider execution attempt.',
        );
      }

      if (!aggregate.methodId) {
        throw new Error(
          'Financial Payment does not have a selected payment method.',
        );
      }

      const paymentMethod = await this.paymentMethodRepository.findByPublicId(
        aggregate.methodId,
      );

      if (paymentMethod === null) {
        throw new Error(
          'The selected Financial Payment Method could not be found.',
        );
      }

      if (!paymentMethod.canBeUsed()) {
        throw new Error(
          'The selected Financial Payment Method is not available for use.',
        );
      }

      if (!paymentMethod.accountId.equals(aggregate.accountId)) {
        throw new Error(
          'The selected Financial Payment Method does not belong to this Financial Account.',
        );
      }

      if (!paymentMethod.provider.isMpesa()) {
        throw new Error(
          'The selected Financial Payment Method is not configured for M-PESA.',
        );
      }

      if (!paymentMethod.phoneNumber) {
        throw new Error(
          'The selected M-PESA Payment Method has no registered phone number.',
        );
      }

      if (aggregate.amount.currency.value !== 'KES') {
        throw new Error(
          'M-PESA STK Push currently supports KES payments only.',
        );
      }

      if (!aggregate.amount.isPositive()) {
        throw new Error('M-PESA payment amount must be greater than zero.');
      }

      const amount = aggregate.amount.amount;

      const provider = await this.providerRepository.findByCode(
        FinancialPaymentProviderCode.create('MPESA'),
      );

      if (provider === null) {
        throw new Error(
          'The configured M-PESA payment provider could not be found.',
        );
      }

      provider.ensureCanPerform(
        FinancialPaymentProviderCapabilityType.create('INITIATE_PAYMENT'),
      );

      const now = new Date();

      const attempt = FinancialPaymentAttemptEntity.create(
        aggregate.id,
        FinancialProvider.create('MPESA'),
        aggregate.amount,
      );

      attempt.start(now);

      aggregate.addAttempt(attempt, command.correlationId, command.causationId);

      aggregate.startProcessing(
        now,
        command.correlationId,
        command.causationId,
      );

      await this.paymentRepository.save(aggregate);

      return {
        paymentPublicId: aggregate.publicId,
        attemptPublicId: attempt.publicId,
        providerPublicId: provider.publicId.value,
        phoneNumber: paymentMethod.phoneNumber.value,
        amount,
        accountReference: aggregate.publicId.value.slice(-12),
      };
    });

    // -------------------------------------------------------------------------
    // 2. Initiate STK Push outside the database transaction
    // -------------------------------------------------------------------------

    let result: MpesaStkPushResult;

    try {
      result = await this.mpesaStkPushService.initiate({
        providerPublicId: prepared.providerPublicId,
        phoneNumber: prepared.phoneNumber,
        amount: prepared.amount,
        accountReference: prepared.accountReference,
        transactionDescription: 'Payment',
      });
    } catch {
      // A thrown exception does not establish that Safaricom rejected
      // the request. The request may already have reached Safaricom.
      //
      // Preserve the active attempt.
      // Never submit another STK Push automatically.

      this.logger.error(
        `M-PESA initiation outcome is unresolved. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
      );

      return this.loadPayment(prepared.paymentPublicId);
    }

    // -------------------------------------------------------------------------
    // 3. Persist the provider outcome transactionally
    // -------------------------------------------------------------------------

    let persisted: {
      outcome: MpesaStkPushResult['outcome'];
      checkoutRequestId: string | null;
      merchantRequestId: string | null;
    };

    try {
      persisted = await this.unitOfWork.execute(async () => {
        const aggregate = await this.paymentRepository.findByPublicId(
          prepared.paymentPublicId,
        );

        if (aggregate === null) {
          throw new FinancialPaymentNotFoundException(
            prepared.paymentPublicId.value,
          );
        }

        const attempt = aggregate.getLatestAttempt();

        if (
          attempt === undefined ||
          attempt.publicId.value !== prepared.attemptPublicId.value
        ) {
          throw new Error(
            'The Financial Payment Attempt changed during provider execution.',
          );
        }

        // ---------------------------------------------------------------------
        // Normalize Safaricom identifiers
        // ---------------------------------------------------------------------

        const checkoutRequestId = result.checkoutRequestId?.trim() || null;

        const merchantRequestId = result.merchantRequestId?.trim() || null;

        // ---------------------------------------------------------------------
        // Explicit provider rejection
        // ---------------------------------------------------------------------

        if (result.outcome === 'REJECTED') {
          if (!attempt.isTerminal()) {
            const now = new Date();

            attempt.fail(
              result.responseCode ?? 'PROVIDER_REJECTED',
              result.responseDescription ?? 'Safaricom rejected the request.',
              now,
            );

            aggregate.fail(now, command.correlationId, command.causationId);

            await this.paymentRepository.save(aggregate);
          }

          return {
            outcome: result.outcome,
            checkoutRequestId: null,
            merchantRequestId: null,
          };
        }

        // ---------------------------------------------------------------------
        // Accepted or uncertain outcome
        // ---------------------------------------------------------------------
        //
        // CheckoutRequestID and MerchantRequestID are separate identifiers.
        //
        // CheckoutRequestID:
        //   Stored as providerReference.
        //
        // MerchantRequestID:
        //   Stored as merchantRequestId.
        //
        // Either identifier may be available independently.
        //
        // Neither ACCEPTED nor UNCERTAIN means payment success.
        // Keep the attempt active until callback reconciliation establishes
        // the actual payment result.
        // ---------------------------------------------------------------------

        let identifiersChanged = false;

        if (!attempt.isTerminal()) {
          // Save CheckoutRequestID.
          if (checkoutRequestId !== null && !attempt.hasProviderReference()) {
            attempt.setProviderReference(
              FinancialProviderReference.create(checkoutRequestId),
            );

            identifiersChanged = true;
          }

          // Save MerchantRequestID independently.
          if (merchantRequestId !== null && !attempt.hasMerchantRequestId()) {
            attempt.setMerchantRequestId(merchantRequestId);

            identifiersChanged = true;
          }

          // Persist both identifiers together.
          if (identifiersChanged) {
            await this.paymentRepository.save(aggregate);
          }
        }

        return {
          outcome: result.outcome,
          checkoutRequestId,
          merchantRequestId,
        };
      });
    } catch {
      // Safaricom may have accepted the request even if local persistence
      // failed. Do not initiate another STK Push.

      this.logger.error(
        `M-PESA provider outcome could not be fully persisted. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation is required.`,
      );

      return this.loadPayment(prepared.paymentPublicId);
    }

    // -------------------------------------------------------------------------
    // 4. Reconcile callbacks received before CheckoutRequestID was persisted
    // -------------------------------------------------------------------------

    if (persisted.checkoutRequestId !== null) {
      try {
        await this.mpesaCallbackService.reconcilePendingCallback(
          persisted.checkoutRequestId,
        );
      } catch {
        this.logger.error(
          `Pending M-PESA callback reconciliation failed. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 5. Log unresolved outcomes
    // -------------------------------------------------------------------------

    if (persisted.outcome === 'UNCERTAIN') {
      this.logger.warn(
        `M-PESA payment remains unresolved. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. MerchantRequestID: ${persisted.merchantRequestId ?? 'NOT AVAILABLE'}; CheckoutRequestID: ${persisted.checkoutRequestId ?? 'NOT AVAILABLE'}. No automatic resubmission will occur.`,
      );
    }

    if (
      persisted.outcome === 'ACCEPTED' &&
      persisted.checkoutRequestId === null
    ) {
      this.logger.warn(
        `M-PESA accepted the request without a checkout reference. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. MerchantRequestID: ${persisted.merchantRequestId ?? 'NOT AVAILABLE'}. Reconciliation is required.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Return the latest persisted payment state
    // -------------------------------------------------------------------------

    return this.loadPayment(prepared.paymentPublicId);
  }

  // ===========================================================================
  // Reload Payment
  // ===========================================================================

  private async loadPayment(
    paymentPublicId: typeof FinancialPaymentAggregate.prototype.publicId,
  ): Promise<FinancialPaymentAggregate> {
    return this.unitOfWork.execute(async () => {
      const aggregate =
        await this.paymentRepository.findByPublicId(paymentPublicId);

      if (aggregate === null) {
        throw new FinancialPaymentNotFoundException(paymentPublicId.value);
      }

      return aggregate;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialPaymentHandler;
