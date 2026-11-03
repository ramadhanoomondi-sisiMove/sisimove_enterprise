import { Inject, Injectable, Logger } from '@nestjs/common';

import { FINANCIAL_PAYMENT_TOKENS } from '../../../../financial/application';

import { FINANCIAL_PAYMENT_CALLBACK_TOKENS } from '../../../application/financial-payment-callback.tokens';

import type {
  FinancialPaymentCallbackRepository,
  FinancialPaymentCallbackRecord,
} from '../../../domain/repositories/financial-payment-callback.repository';

import { UNIT_OF_WORK } from '../../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../../foundation/events/event-publisher.interface';

import type { FinancialPaymentRepository } from '../../../../financial/domain/repositories/financial-payment.repository';

import {
  FinancialProvider,
  FinancialProviderReference,
} from '../../../../financial/domain/value-objects';

import type { FinancialPaymentAggregate } from '../../../../financial/domain/aggregates/financial-payment.aggregate';
import type { FinancialPaymentAttemptEntity } from '../../../../financial/domain/entities/financial-payment-attempt.entity';

// =============================================================================
// Callback Types
// =============================================================================

interface MpesaCallbackMetadataItem {
  Name: string;
  Value?: string | number;
}

interface MpesaCallbackMetadata {
  Item?: MpesaCallbackMetadataItem[];
}

interface MpesaStkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: MpesaCallbackMetadata;
}

export interface MpesaCallbackResult {
  processed: boolean;
  duplicate: boolean;
  paymentPublicId?: string;
  attemptPublicId?: string;
  message: string;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaCallbackService {
  private readonly logger = new Logger(MpesaCallbackService.name);

  private readonly provider = FinancialProvider.create('MPESA');

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly paymentRepository: FinancialPaymentRepository,

    @Inject(FINANCIAL_PAYMENT_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialPaymentCallbackRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Process Incoming Callback
  // ===========================================================================

  /**
   * Persists the callback before attempting payment reconciliation.
   *
   * This ensures that callbacks arriving before CheckoutRequestID has been
   * persisted on the Payment Attempt are not lost.
   */
  public async processCallback(body: unknown): Promise<MpesaCallbackResult> {
    const callback = this.extractCallback(body);

    const checkoutRequestId = callback.CheckoutRequestID.trim();
    const merchantRequestId = callback.MerchantRequestID.trim();

    if (!checkoutRequestId || !merchantRequestId) {
      throw new Error('M-PESA callback is missing its request identifiers.');
    }

    // -------------------------------------------------------------------------
    // 1. Persist callback first
    // -------------------------------------------------------------------------

    const callbackRecord = await this.callbackRepository.createIfNotExists({
      provider: this.provider.value,
      merchantRequestId,
      checkoutRequestId,
      resultCode: callback.ResultCode,
      resultDesc: callback.ResultDesc,
      payload: body,
    });

    // -------------------------------------------------------------------------
    // 2. Handle previously processed callback
    // -------------------------------------------------------------------------

    if (callbackRecord.status === 'PROCESSED') {
      return {
        processed: false,
        duplicate: true,
        message: 'Callback already processed.',
      };
    }

    // -------------------------------------------------------------------------
    // 3. Attempt reconciliation
    // -------------------------------------------------------------------------

    return this.reconcileCallback(callbackRecord);
  }

  // ===========================================================================
  // Reconcile Pending Callback
  // ===========================================================================

  /**
   * Called after the payment handler persists CheckoutRequestID.
   *
   * This handles the callback-before-reference-persistence race.
   */
  public async reconcilePendingCallback(
    checkoutRequestId: string,
  ): Promise<MpesaCallbackResult> {
    const normalizedReference = checkoutRequestId.trim();

    if (!normalizedReference) {
      throw new Error('CheckoutRequestID must not be empty.');
    }

    const callbackRecord =
      await this.callbackRepository.findByProviderCheckoutRequestId(
        this.provider.value,
        normalizedReference,
      );

    if (callbackRecord === null) {
      return {
        processed: false,
        duplicate: false,
        message: 'No pending M-PESA callback was found.',
      };
    }

    if (callbackRecord.status === 'PROCESSED') {
      return {
        processed: false,
        duplicate: true,
        message: 'Callback already processed.',
      };
    }

    return this.reconcileCallback(callbackRecord);
  }

  // ===========================================================================
  // Reconciliation
  // ===========================================================================

  private async reconcileCallback(
    callbackRecord: FinancialPaymentCallbackRecord,
  ): Promise<MpesaCallbackResult> {
    const callback = this.extractCallback(callbackRecord.payload);

    const checkoutRequestId = callback.CheckoutRequestID.trim();
    const merchantRequestId = callback.MerchantRequestID.trim();

    const providerReference =
      FinancialProviderReference.create(checkoutRequestId);

    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Locate payment
      // -----------------------------------------------------------------------

      const aggregate = await this.paymentRepository.findByProviderReference(
        this.provider,
        providerReference,
      );

      // The payment reference may not have been persisted yet.
      // Keep the callback pending for later reconciliation.

      if (aggregate === null) {
        this.logger.warn(
          `M-PESA callback "${checkoutRequestId}" is pending because its Financial Payment has not been located.`,
        );

        return {
          processed: false,
          duplicate: false,
          message: 'Callback persisted and awaiting payment reconciliation.',
        };
      }

      // -----------------------------------------------------------------------
      // 2. Locate matching attempt
      // -----------------------------------------------------------------------

      const attempt = this.findMatchingAttempt(aggregate, checkoutRequestId);

      if (attempt === undefined) {
        this.logger.warn(
          `M-PESA callback "${checkoutRequestId}" is pending because its Payment Attempt has not been located.`,
        );

        return {
          processed: false,
          duplicate: false,
          paymentPublicId: aggregate.publicId.value,
          message: 'Callback persisted and awaiting matching payment attempt.',
        };
      }

      // -----------------------------------------------------------------------
      // 3. Idempotency
      // -----------------------------------------------------------------------

      if (attempt.isTerminal()) {
        this.logger.warn(
          `Ignoring duplicate M-PESA callback for attempt "${attempt.publicId.value}".`,
        );

        await this.callbackRepository.markProcessed(
          callbackRecord.id,
          attempt.id.toString(),
          new Date(),
        );

        return {
          processed: false,
          duplicate: true,
          paymentPublicId: aggregate.publicId.value,
          attemptPublicId: attempt.publicId.value,
          message: 'Payment attempt already reached a terminal state.',
        };
      }

      // -----------------------------------------------------------------------
      // 4. Validate callback amount
      // -----------------------------------------------------------------------

      this.validateCallbackAmount(callback, attempt);

      // -----------------------------------------------------------------------
      // 5. Apply provider result
      // -----------------------------------------------------------------------

      const now = new Date();
      const correlationId = checkoutRequestId;
      const causationId = merchantRequestId;

      if (callback.ResultCode === 0) {
        attempt.succeed(now);

        aggregate.succeed(now, correlationId, causationId);
      } else {
        const failureCode = String(callback.ResultCode);

        const failureMessage = this.sanitizeFailureMessage(callback.ResultDesc);

        attempt.fail(failureCode, failureMessage, now);

        aggregate.fail(now, correlationId, causationId);
      }

      // -----------------------------------------------------------------------
      // 6. Persist payment aggregate
      // -----------------------------------------------------------------------

      await this.paymentRepository.save(aggregate);

      // -----------------------------------------------------------------------
      // 7. Mark callback processed
      // -----------------------------------------------------------------------

      await this.callbackRepository.markProcessed(
        callbackRecord.id,
        attempt.id.toString(),
        now,
      );

      // -----------------------------------------------------------------------
      // 8. Publish domain events
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      // -----------------------------------------------------------------------
      // 9. Return result
      // -----------------------------------------------------------------------

      this.logger.log(
        `Processed M-PESA callback for payment "${aggregate.publicId.value}".`,
      );

      return {
        processed: true,
        duplicate: false,
        paymentPublicId: aggregate.publicId.value,
        attemptPublicId: attempt.publicId.value,
        message:
          callback.ResultCode === 0
            ? 'M-PESA payment callback processed successfully.'
            : 'M-PESA payment failure callback processed.',
      };
    });
  }

  // ===========================================================================
  // Callback Extraction and Validation
  // ===========================================================================

  private extractCallback(body: unknown): MpesaStkCallback {
    if (typeof body !== 'object' || body === null || !('Body' in body)) {
      throw new Error('Invalid M-PESA callback payload.');
    }

    const callbackBody = body.Body;

    if (
      typeof callbackBody !== 'object' ||
      callbackBody === null ||
      !('stkCallback' in callbackBody)
    ) {
      throw new Error('Invalid M-PESA callback payload.');
    }

    const callback = callbackBody.stkCallback;

    if (
      typeof callback !== 'object' ||
      callback === null ||
      !('CheckoutRequestID' in callback) ||
      !('MerchantRequestID' in callback) ||
      !('ResultDesc' in callback) ||
      !('ResultCode' in callback)
    ) {
      throw new Error('M-PESA callback contains invalid fields.');
    }

    const candidate = callback as Record<string, unknown>;

    if (
      typeof candidate.CheckoutRequestID !== 'string' ||
      typeof candidate.MerchantRequestID !== 'string' ||
      typeof candidate.ResultDesc !== 'string' ||
      typeof candidate.ResultCode !== 'number' ||
      !Number.isInteger(candidate.ResultCode)
    ) {
      throw new Error('M-PESA callback contains invalid fields.');
    }

    if (
      candidate.CallbackMetadata !== undefined &&
      !this.isValidCallbackMetadata(candidate.CallbackMetadata)
    ) {
      throw new Error('M-PESA callback contains invalid transaction metadata.');
    }

    return candidate as unknown as MpesaStkCallback;
  }

  // ===========================================================================
  // Callback Metadata Validation
  // ===========================================================================

  private isValidCallbackMetadata(
    metadata: unknown,
  ): metadata is MpesaCallbackMetadata {
    if (
      typeof metadata !== 'object' ||
      metadata === null ||
      !('Item' in metadata)
    ) {
      return false;
    }

    const items = metadata.Item;

    if (!Array.isArray(items)) {
      return false;
    }

    return items.every((item: unknown) => {
      if (typeof item !== 'object' || item === null || !('Name' in item)) {
        return false;
      }

      const candidate = item as Record<string, unknown>;

      return (
        typeof candidate.Name === 'string' &&
        (candidate.Value === undefined ||
          typeof candidate.Value === 'string' ||
          typeof candidate.Value === 'number')
      );
    });
  }

  // ===========================================================================
  // Find Matching Attempt
  // ===========================================================================

  private findMatchingAttempt(
    aggregate: FinancialPaymentAggregate,
    checkoutRequestId: string,
  ): FinancialPaymentAttemptEntity | undefined {
    return aggregate.attempts.find(
      (attempt) =>
        attempt.provider.value === this.provider.value &&
        attempt.providerReference?.value === checkoutRequestId,
    );
  }

  // ===========================================================================
  // Validate Callback Amount
  // ===========================================================================

  private validateCallbackAmount(
    callback: MpesaStkCallback,
    attempt: FinancialPaymentAttemptEntity,
  ): void {
    const amountItem = callback.CallbackMetadata?.Item?.find(
      (item) => item.Name === 'Amount',
    );

    // Failed STK callbacks may not contain transaction metadata.
    if (amountItem === undefined) {
      return;
    }

    const callbackAmount = Number(amountItem.Value);

    if (!Number.isFinite(callbackAmount) || callbackAmount <= 0) {
      throw new Error(
        'M-PESA callback contains an invalid transaction amount.',
      );
    }

    if (callbackAmount !== attempt.amount.amount) {
      throw new Error(
        'M-PESA callback amount does not match the Financial Payment Attempt amount.',
      );
    }
  }

  // ===========================================================================
  // Sanitize Provider Failure Message
  // ===========================================================================

  private sanitizeFailureMessage(message: string): string {
    const normalized = message.trim();

    if (!normalized) {
      return 'M-PESA payment was not completed.';
    }

    return normalized.slice(0, 500);
  }
}
