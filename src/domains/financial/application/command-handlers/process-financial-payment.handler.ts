// -----------------------------------------------------------------------------
// Financial Payment — Process Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Load and validate the Financial Payment.
// 2. Resolve and validate its selected payment method.
// 3. Resolve and validate the M-PESA provider.
// 4. Create and attach a Financial Payment Attempt.
// 5. Start payment and attempt processing.
// 6. Persist the payment and attempt using PrismaUnitOfWork.
// 7. Initiate M-PESA STK Push outside the database transaction.
// 8. Store the CheckoutRequestID using PrismaUnitOfWork.
// 9. Reconcile any callback received before the provider reference was saved.
// 10. Persist explicit provider rejection when received.
//
// Safaricom acceptance is NOT payment success.
// Final payment success or failure is determined by callback processing.
//
// Database operations use PrismaUnitOfWork.
// External provider communication must not run inside its transaction.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Unit Of Work
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialPaymentAttemptEntity } from '../../domain/entities/financial-payment-attempt.entity';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';

import { FinancialProviderReference } from '../../domain/value-objects/financial-provider-reference.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderCapabilityType } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

// -----------------------------------------------------------------------------
// M-PESA Integration
// -----------------------------------------------------------------------------

import { MpesaStkPushService } from '../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-stk-push.service';

import { MpesaCallbackService } from '../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-callback.service';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class ProcessFinancialPaymentHandler implements CommandHandler<
  ProcessFinancialPaymentCommand,
  FinancialPaymentAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

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
    // 1. Prepare and persist payment attempt transactionally
    // -------------------------------------------------------------------------

    const prepared = await this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // Load payment
      // -----------------------------------------------------------------------

      const aggregate = await this.paymentRepository.findByPublicId(
        command.paymentPublicId,
      );

      if (aggregate === null) {
        throw new FinancialPaymentNotFoundException(
          command.paymentPublicId.value,
        );
      }

      // -----------------------------------------------------------------------
      // Validate payment state
      // -----------------------------------------------------------------------

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

      // -----------------------------------------------------------------------
      // Resolve payment method
      // -----------------------------------------------------------------------

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

      // -----------------------------------------------------------------------
      // Validate amount and currency
      // -----------------------------------------------------------------------

      if (aggregate.amount.currency.value !== 'KES') {
        throw new Error(
          'M-PESA STK Push currently supports KES payments only.',
        );
      }

      if (!aggregate.amount.isPositive()) {
        throw new Error('M-PESA payment amount must be greater than zero.');
      }

      // Money.amount is already an integer KES amount.
      const amount = aggregate.amount.amount;

      // -----------------------------------------------------------------------
      // Resolve M-PESA provider
      // -----------------------------------------------------------------------

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

      // -----------------------------------------------------------------------
      // Create payment attempt
      // -----------------------------------------------------------------------

      const now = new Date();

      const attempt = FinancialPaymentAttemptEntity.create(
        aggregate.id,
        FinancialProvider.create('MPESA'),
        aggregate.amount,
      );

      attempt.start(now);

      aggregate.addAttempt(attempt, command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // Start payment processing
      // -----------------------------------------------------------------------

      aggregate.startProcessing(
        now,
        command.correlationId,
        command.causationId,
      );

      // -----------------------------------------------------------------------
      // Persist payment and attempt
      // -----------------------------------------------------------------------

      await this.paymentRepository.save(aggregate);

      // -----------------------------------------------------------------------
      // Return only the data needed for provider execution
      // -----------------------------------------------------------------------

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
    // 2. Execute M-PESA STK Push outside the transaction
    // -------------------------------------------------------------------------

    // A network timeout may occur after Safaricom has accepted the request.
    // Therefore, an exception here must not automatically mark the payment
    // FAILED.

    const result = await this.mpesaStkPushService.initiate({
      providerPublicId: prepared.providerPublicId,
      phoneNumber: prepared.phoneNumber,
      amount: prepared.amount,
      accountReference: prepared.accountReference,
      transactionDescription: 'Payment',
    });

    // -------------------------------------------------------------------------
    // 3. Persist provider response transactionally
    // -------------------------------------------------------------------------

    const persisted = await this.unitOfWork.execute(async () => {
      // Reload the aggregate instead of saving the stale in-memory instance.
      // This helps avoid overwriting a callback update that may already have
      // been persisted.

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

      // -----------------------------------------------------------------------
      // Handle explicit provider rejection
      // -----------------------------------------------------------------------

      if (!result.accepted) {
        if (!attempt.isTerminal()) {
          attempt.fail(
            result.responseCode,
            result.responseDescription,
            new Date(),
          );

          aggregate.fail(
            new Date(),
            command.correlationId,
            command.causationId,
          );

          await this.paymentRepository.save(aggregate);
        }

        return {
          accepted: false,
          checkoutRequestId: null,
        };
      }

      // -----------------------------------------------------------------------
      // Validate provider reference
      // -----------------------------------------------------------------------

      if (!result.checkoutRequestId?.trim()) {
        throw new Error(
          'M-PESA accepted the request but did not return a CheckoutRequestID. Payment requires reconciliation.',
        );
      }

      const checkoutRequestId = result.checkoutRequestId.trim();

      // -----------------------------------------------------------------------
      // Store CheckoutRequestID
      // -----------------------------------------------------------------------

      if (!attempt.isTerminal()) {
        attempt.setProviderReference(
          FinancialProviderReference.create(checkoutRequestId),
        );

        await this.paymentRepository.save(aggregate);
      }

      return {
        accepted: true,
        checkoutRequestId,
      };
    });

    // -------------------------------------------------------------------------
    // 4. Reconcile an early callback after provider reference persistence
    // -------------------------------------------------------------------------

    if (persisted.accepted && persisted.checkoutRequestId !== null) {
      await this.mpesaCallbackService.reconcilePendingCallback(
        persisted.checkoutRequestId,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Reload the latest payment state
    // -------------------------------------------------------------------------

    return this.unitOfWork.execute(async () => {
      const aggregate = await this.paymentRepository.findByPublicId(
        prepared.paymentPublicId,
      );

      if (aggregate === null) {
        throw new FinancialPaymentNotFoundException(
          prepared.paymentPublicId.value,
        );
      }

      return aggregate;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialPaymentHandler;
