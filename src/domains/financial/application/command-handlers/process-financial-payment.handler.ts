/**
 * -----------------------------------------------------------------------------
 * Financial Payment — Process Command Handler
 * -----------------------------------------------------------------------------
 *
 * Application orchestration for processing a Financial Payment through
 * Safaricom M-PESA STK Push.
 *
 * Workflow:
 *
 * 1. Load and validate the Financial Payment.
 * 2. Resolve and validate the selected M-PESA Payment Method.
 * 3. Resolve the M-PESA provider and validate its capability.
 * 4. Create and persist a PROCESSING attempt and its domain events.
 * 5. Submit the STK Push request outside the database transaction.
 * 6. Persist provider-issued request identifiers.
 * 7. Preserve callback correlation information for FinancialModule processing.
 * 8. Preserve uncertain outcomes without automatic resubmission.
 * 9. Process normalized STK outcomes through the same payment lifecycle.
 * 10. Persist final payment/attempt transitions and publish their events.
 * 11. Return the latest persisted payment aggregate.
 *
 * IMPORTANT:
 *
 * - This handler is exclusively for the STK Push channel.
 * - C2B payments are processed through their separate application workflow.
 * - Financial amounts are stored in minor units.
 * - Daraja STK Push expects whole KES amounts.
 * - An accepted STK Push request does not mean the customer has paid.
 * - Final payment success or failure is determined by FinancialModule after
 *   processing authoritative provider callback or status-query results.
 * - This handler owns STK outcome correlation and payment lifecycle
 *   transitions using the durable FinancialPaymentCallback inbox.
 * - Pending callbacks remain pending when correlation is not yet possible.
 * - This handler does not directly post financial transactions or mutate
 *   account balances.
 * - A repeated command must not automatically submit another STK Push.
 *
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable, Logger } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { FINANCIAL_PAYMENT_CALLBACK_TOKENS } from '../../application/financial-payment-callback.tokens';

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

import { FinancialPaymentAttemptEntity } from '../../domain/entities/financial-payment-attempt.entity';

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

import type {
  FinancialPaymentCallbackRepository,
  FinancialPaymentCallbackRecord,
} from '../../../financial-payment-providers/domain/repositories/financial-payment-callback.repository';

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';

import { FinancialProviderReference } from '../../domain/value-objects/financial-provider-reference.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderCapabilityType } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

// -----------------------------------------------------------------------------
// M-PESA STK Push
// -----------------------------------------------------------------------------

import { StkPushService } from '../../../../mpesa/stk-push/stk-push.service';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

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

    @Inject(FINANCIAL_PAYMENT_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialPaymentCallbackRepository,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly paymentMethodRepository: FinancialPaymentMethodRepository,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly stkPushService: StkPushService,

    private readonly unitOfWork: PrismaUnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
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
      // Serialize all first-attempt creation for this payment.
      // This must be the first database operation in this transaction.
      await this.paymentRepository.lockByPublicId(command.paymentPublicId);

      const aggregate = await this.paymentRepository.findByPublicId(
        command.paymentPublicId,
      );

      if (aggregate === null) {
        throw new FinancialPaymentNotFoundException(
          command.paymentPublicId.value,
        );
      }

      // This handler is exclusively for STK Push.
      if (!aggregate.channel.isStkPush()) {
        throw new Error(
          'This Financial Payment is not configured for the STK Push channel.',
        );
      }

      // An existing attempt means a provider submission may already have
      // occurred. A replay must never create or submit another prompt.
      if (aggregate.attempts.length > 0) {
        this.logger.warn(
          `Financial Payment already has an execution attempt. ` +
            `Skipping duplicate STK Push submission. Payment: ${aggregate.publicId.value}.`,
        );

        return {
          kind: 'ALREADY_ATTEMPTED' as const,
          paymentPublicId: aggregate.publicId,
        };
      }

      if (!aggregate.canCreateAttempt()) {
        throw new Error(
          'Financial Payment cannot create another provider execution attempt.',
        );
      }

      // -----------------------------------------------------------------------
      // Payment method validation
      // -----------------------------------------------------------------------

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

      // -----------------------------------------------------------------------
      // Currency and amount validation
      // -----------------------------------------------------------------------

      if (aggregate.amount.currency.value !== 'KES') {
        throw new Error(
          'M-PESA STK Push currently supports KES payments only.',
        );
      }

      if (!aggregate.amount.isPositive()) {
        throw new Error('M-PESA payment amount must be greater than zero.');
      }

      // Financial Money is stored in minor units; Daraja expects whole KES.
      const amountInMinorUnits = aggregate.amount.amount;

      if (
        !Number.isSafeInteger(amountInMinorUnits) ||
        amountInMinorUnits < 100 ||
        amountInMinorUnits % 100 !== 0
      ) {
        throw new Error(
          'M-PESA STK Push amount must be a positive whole KES amount.',
        );
      }

      const amountKes = amountInMinorUnits / 100;

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
      // Create and persist the first payment attempt
      // -----------------------------------------------------------------------

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

      // Persist lifecycle events to the outbox in this same UnitOfWork.
      // EventStore uses the ambient Prisma transaction, so payment state and
      // its events commit or roll back together.
      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      return {
        kind: 'READY' as const,
        paymentPublicId: aggregate.publicId,
        attemptPublicId: attempt.publicId,
        providerPublicId: provider.publicId.value,
        phoneNumber: paymentMethod.phoneNumber.value,
        amountKes,
        accountReference: aggregate.publicId.value.slice(-12),
      };
    });

    // Do not call loadPayment() from inside PrismaUnitOfWork. That would
    // attempt to start a nested transaction. Reload only after it commits.
    if (prepared.kind === 'ALREADY_ATTEMPTED') {
      return this.loadPayment(prepared.paymentPublicId);
    }

    // -------------------------------------------------------------------------
    // 2. Initiate STK Push outside the database transaction
    // -------------------------------------------------------------------------

    // The only remaining branch is READY; its attempt is already committed.
    if (prepared.kind !== 'READY') {
      throw new Error('Unexpected Financial Payment preparation state.');
    }

    let result: Awaited<ReturnType<StkPushService['initiate']>>;

    try {
      result = await this.stkPushService.initiate({
        providerPublicId: prepared.providerPublicId,
        phoneNumber: prepared.phoneNumber,
        amount: prepared.amountKes,
        accountReference: prepared.accountReference,
        transactionDescription: 'Payment',
      });
    } catch (error) {
      // A failed HTTP request does not necessarily mean Safaricom rejected
      // the request. Safaricom may already have received it.
      //
      // Keep the attempt active and require reconciliation.
      // Never automatically submit another STK Push.

      this.logger.error(
        `M-PESA initiation outcome is unresolved. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}.`,
        error instanceof Error ? error.stack : undefined,
      );

      return this.loadPayment(prepared.paymentPublicId);
    }

    // -------------------------------------------------------------------------
    // 3. Persist the provider response transactionally
    // -------------------------------------------------------------------------

    let persisted: {
      checkoutRequestId: string;
      merchantRequestId: string;
    };

    try {
      persisted = await this.unitOfWork.execute(async () => {
        await this.paymentRepository.lockByPublicId(prepared.paymentPublicId);

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

        const checkoutRequestId = result.checkoutRequestId.trim();

        const merchantRequestId = result.merchantRequestId.trim();

        if (!checkoutRequestId || !merchantRequestId) {
          throw new Error(
            'Safaricom response is missing its request identifiers.',
          );
        }

        // ---------------------------------------------------------------------
        // Save CheckoutRequestID and MerchantRequestID independently
        // ---------------------------------------------------------------------

        // A callback may have completed the attempt before this HTTP response
        // was persisted. Never overwrite a terminal attempt.

        if (!attempt.isTerminal()) {
          let identifiersChanged = false;

          if (!attempt.hasProviderReference()) {
            attempt.setProviderReference(
              FinancialProviderReference.create(checkoutRequestId),
            );

            identifiersChanged = true;
          }

          if (!attempt.hasMerchantRequestId()) {
            attempt.setMerchantRequestId(merchantRequestId);

            identifiersChanged = true;
          }

          if (identifiersChanged) {
            await this.paymentRepository.save(aggregate);
          }
        }

        return {
          checkoutRequestId,
          merchantRequestId,
        };
      });
    } catch (error) {
      // Safaricom may have accepted the request even if local persistence
      // failed. Do not initiate another STK Push.

      this.logger.error(
        `M-PESA provider response could not be fully persisted. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}. Reconciliation is required.`,
        error instanceof Error ? error.stack : undefined,
      );

      return this.loadPayment(prepared.paymentPublicId);
    }

    // -------------------------------------------------------------------------
    // 4. Preserve callback correlation information
    // -------------------------------------------------------------------------

    // FinancialModule owns callback correlation and reconciliation.
    // The M-PESA callback handler only validates and normalizes provider
    // callback payloads.
    //
    // No callback reconciliation is performed here. A callback received before
    // CheckoutRequestID is persisted must be handled by the FinancialModule
    // callback infrastructure when that workflow is connected.

    this.logger.debug(
      `M-PESA STK Push identifiers persisted. Payment: ${prepared.paymentPublicId.value}; Attempt: ${prepared.attemptPublicId.value}; CheckoutRequestID: ${persisted.checkoutRequestId}.`,
    );

    // A callback may have arrived before the provider identifiers were saved.
    // Retry pending inbox records now that this initiation has committed them.
    // The bounded processor catches per-record failures and leaves them pending.
    await this.processPendingStkCallbacks(50);

    // -------------------------------------------------------------------------
    // 5. Return the latest persisted payment state
    // -------------------------------------------------------------------------

    return this.loadPayment(prepared.paymentPublicId);
  }

  // ===========================================================================
  // Process Pending STK Callback Inbox
  // ===========================================================================

  /**
   * Processes a bounded batch of durable STK callback inbox records.
   *
   * Each callback is re-read and reconciled inside the same UnitOfWork that
   * applies the payment/attempt transition, publishes domain events to the
   * Outbox, and marks the callback PROCESSED.
   *
   * A callback that cannot yet be correlated remains PENDING. Infrastructure
   * failures also leave the record pending because the transaction rolls back.
   */
  public async processPendingStkCallbacks(limit = 50): Promise<{
    scanned: number;
    processed: number;
    pending: number;
    failed: number;
  }> {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error(
        'STK callback recovery limit must be a positive integer.',
      );
    }

    const callbacks = await this.callbackRepository.findPending(
      Math.min(limit, 500),
    );

    let processed = 0;
    let pending = 0;

    for (const callback of callbacks) {
      try {
        const result = await this.processPendingStkCallback(callback);

        if (result === 'PROCESSED') {
          processed += 1;
        } else {
          pending += 1;
        }
      } catch (error) {
        // Do not mark transient processing errors as FAILED. The UnitOfWork
        // rolls back payment, Outbox and callback status changes together.
        pending += 1;

        this.logger.error(
          `STK callback reconciliation failed; callback remains pending. ` +
            `CheckoutRequestID: ${callback.checkoutRequestId}; Callback: ${callback.id}.`,
          error instanceof Error ? error.stack : undefined,
        );
      }
    }

    return {
      scanned: callbacks.length,
      processed,
      pending,
      failed: 0,
    };
  }

  // ===========================================================================
  // Process One Pending STK Callback
  // ===========================================================================

  private async processPendingStkCallback(
    candidate: FinancialPaymentCallbackRecord,
  ): Promise<'PROCESSED' | 'PENDING'> {
    return this.unitOfWork.execute(async () => {
      // Re-read the callback inside the transaction. Another worker may have
      // processed it after the initial pending-batch query.
      const callback =
        await this.callbackRepository.findByProviderCheckoutRequestId(
          candidate.provider,
          candidate.checkoutRequestId,
        );

      if (callback === null || callback.status !== 'PENDING') {
        return 'PROCESSED';
      }

      if (callback.provider !== 'MPESA') {
        throw new Error(
          `Unsupported provider on STK callback inbox record ${callback.id}.`,
        );
      }

      const checkoutRequestId = callback.checkoutRequestId.trim();
      const merchantRequestId = callback.merchantRequestId.trim();

      if (!checkoutRequestId || !merchantRequestId) {
        throw new Error(
          `STK callback ${callback.id} has incomplete provider request identifiers.`,
        );
      }

      const provider = FinancialProvider.create('MPESA');
      const providerReference =
        FinancialProviderReference.create(checkoutRequestId);

      // Resolve through both identifiers. If neither is present yet, preserve
      // the callback as PENDING for a later recovery pass.
      const [byCheckoutRequest, byMerchantRequest] = await Promise.all([
        this.paymentRepository.findByProviderReference(
          provider,
          providerReference,
        ),
        this.paymentRepository.findByMerchantRequestId(
          provider,
          merchantRequestId,
        ),
      ]);

      if (
        byCheckoutRequest !== null &&
        byMerchantRequest !== null &&
        byCheckoutRequest.publicId.value !== byMerchantRequest.publicId.value
      ) {
        throw new Error(
          'STK callback identifiers resolve to different Financial Payments.',
        );
      }

      const located = byCheckoutRequest ?? byMerchantRequest;

      if (located === null) {
        // Early callback: initiation has not saved its provider identifiers yet.
        // Do not mark it FAILED or PROCESSED.
        return 'PENDING';
      }

      // Serialize callback/query outcomes against other payment transitions.
      await this.paymentRepository.lockByPublicId(located.publicId);

      const aggregate = await this.paymentRepository.findByPublicId(
        located.publicId,
      );

      if (aggregate === null) {
        throw new FinancialPaymentNotFoundException(located.publicId.value);
      }

      if (!aggregate.channel.isStkPush()) {
        throw new Error(
          'The matched Financial Payment is not configured for STK Push.',
        );
      }

      // Both provider identifiers must match the same attempt. A partial match
      // is not sufficient to apply a financial outcome.
      const attempt = aggregate.attempts.find(
        (candidateAttempt) =>
          candidateAttempt.provider.value === 'MPESA' &&
          candidateAttempt.providerReference?.value === checkoutRequestId &&
          candidateAttempt.merchantRequestId === merchantRequestId,
      );

      if (attempt === undefined) {
        // Provider IDs may have been only partially persisted at the moment
        // this callback was observed. Retain it for a later retry.
        return 'PENDING';
      }

      const correlationId = `MPESA-STK:${checkoutRequestId}`;

      // A terminal attempt may have been completed by another authoritative
      // path. Consume the callback without emitting another lifecycle event.
      if (aggregate.isTerminal() || attempt.isTerminal()) {
        this.logger.warn(
          `Consuming duplicate or late STK callback without another transition. ` +
            `Payment: ${aggregate.publicId.value}; Attempt: ${attempt.publicId.value}.`,
        );

        await this.callbackRepository.markProcessed(
          callback.id,
          attempt.id.toString(),
          new Date(),
        );

        return 'PROCESSED';
      }

      const occurredAt = new Date();

      if (callback.resultCode === 0) {
        aggregate.succeedAttempt(attempt.publicId, occurredAt, correlationId);
      } else {
        aggregate.failAttempt(
          attempt.publicId,
          String(callback.resultCode),
          callback.resultDesc.trim().slice(0, 500),
          occurredAt,
          correlationId,
        );
      }

      await this.paymentRepository.save(aggregate);

      // EventStore appends StoredEvent and OutboxMessage through the ambient
      // transaction. Payment state, events and callback status commit together.
      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      await this.callbackRepository.markProcessed(
        callback.id,
        attempt.id.toString(),
        occurredAt,
      );

      return 'PROCESSED';
    });
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
