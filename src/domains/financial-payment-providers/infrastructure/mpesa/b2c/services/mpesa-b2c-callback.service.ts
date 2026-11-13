import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../../../../../financial/application';
import { FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS } from '../../../../../financial/application';

import type { FinancialDisbursementRepository } from '../../../../../financial/domain/repositories/financial-disbursement.repository';

import type {
  FinancialDisbursementCallbackRepository,
  FinancialDisbursementCallbackRecord,
  FinancialDisbursementCallbackType,
} from '../../../../domain/repositories/financial-disbursement-callback.repository';

import { UNIT_OF_WORK } from '../../../../../../foundation/persistence/unit-of-work.token';

import type { UnitOfWork } from '../../../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../../../foundation/events/event-publisher.token';

import type { EventPublisher } from '../../../../../../foundation/events/event-publisher.interface';

import { FinancialProvider } from '../../../../../financial/domain/value-objects';

import type { FinancialDisbursementAggregate } from '../../../../../financial/domain/aggregates/financial-disbursement.aggregate';

import type { FinancialDisbursementAttemptEntity } from '../../../../../financial/domain/entities/financial-disbursement-attempt.entity';

import type {
  MpesaB2CResult,
  MpesaB2CResultCallback,
} from '../contracts/mpesa-b2c-result.interface';

import type { MpesaB2CTimeoutCallback } from '../contracts/mpesa-b2c-timeout.interface';

// =============================================================================
// Callback Types
// =============================================================================

export interface MpesaB2CCallbackResult {
  processed: boolean;
  duplicate: boolean;
  disbursementPublicId?: string;
  attemptPublicId?: string;
  message: string;
}

interface NormalizedB2CCallback {
  type: FinancialDisbursementCallbackType;
  originatorConversationId: string;
  conversationId: string | null;
  transactionId: string | null;
  resultCode: number | null;
  resultDesc: string | null;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaB2CCallbackService {
  private readonly logger = new Logger(MpesaB2CCallbackService.name);

  private readonly provider = FinancialProvider.create('MPESA');

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,

    @Inject(FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialDisbursementCallbackRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Process Result Callback
  // ===========================================================================

  /**
   * Persists a B2C result callback before reconciliation.
   *
   * ResultCode 0 confirms provider success.
   * A non-zero ResultCode confirms provider failure.
   */
  public async processResultCallback(
    body: unknown,
  ): Promise<MpesaB2CCallbackResult> {
    const callback = this.extractResultCallback(body);
    const normalized = this.normalizeResult(callback);

    const callbackRecord = await this.callbackRepository.createIfNotExists({
      provider: this.provider.value,
      type: 'RESULT',
      originatorConversationId: normalized.originatorConversationId,
      conversationId: normalized.conversationId,
      transactionId: normalized.transactionId,
      resultCode: normalized.resultCode,
      resultDesc: normalized.resultDesc,
      payload: body,
    });

    if (callbackRecord.status === 'PROCESSED') {
      return {
        processed: false,
        duplicate: true,
        message: 'M-PESA B2C result callback already processed.',
      };
    }

    return this.reconcileCallback(callbackRecord);
  }

  // ===========================================================================
  // Process Queue Timeout Callback
  // ===========================================================================

  /**
   * Persists a B2C queue timeout callback before reconciliation.
   *
   * A queue timeout does not establish whether the payout succeeded or failed.
   * It must never cause the attempt or parent disbursement to fail.
   */
  public async processQueueTimeoutCallback(
    body: unknown,
  ): Promise<MpesaB2CCallbackResult> {
    const callback = this.extractTimeoutCallback(body);
    const normalized = this.normalizeTimeout(callback);

    const callbackRecord = await this.callbackRepository.createIfNotExists({
      provider: this.provider.value,
      type: 'QUEUE_TIMEOUT',
      originatorConversationId: normalized.originatorConversationId,
      conversationId: normalized.conversationId,
      transactionId: null,
      resultCode: normalized.resultCode,
      resultDesc: normalized.resultDesc,
      payload: body,
    });

    if (callbackRecord.status === 'PROCESSED') {
      return {
        processed: false,
        duplicate: true,
        message: 'M-PESA B2C queue timeout callback already processed.',
      };
    }

    return this.reconcileCallback(callbackRecord);
  }

  // ===========================================================================
  // Reconcile Pending Callback
  // ===========================================================================

  /**
   * Called after provider identifiers have been persisted on the attempt.
   *
   * RESULT and QUEUE_TIMEOUT are separate callback types and are therefore
   * retrieved independently.
   */
  public async reconcilePendingCallback(
    originatorConversationId: string,
  ): Promise<MpesaB2CCallbackResult> {
    const normalizedReference = originatorConversationId.trim();

    if (!normalizedReference) {
      throw new Error('OriginatorConversationID must not be empty.');
    }

    // -------------------------------------------------------------------------
    // 1. Prefer a final provider result
    // -------------------------------------------------------------------------

    const resultCallback =
      await this.callbackRepository.findByProviderOriginatorConversationId(
        this.provider.value,
        normalizedReference,
        'RESULT',
      );

    if (resultCallback !== null && resultCallback.status !== 'PROCESSED') {
      return this.reconcileCallback(resultCallback);
    }

    // -------------------------------------------------------------------------
    // 2. Otherwise reconcile a queue timeout
    // -------------------------------------------------------------------------

    const timeoutCallback =
      await this.callbackRepository.findByProviderOriginatorConversationId(
        this.provider.value,
        normalizedReference,
        'QUEUE_TIMEOUT',
      );

    if (timeoutCallback !== null && timeoutCallback.status !== 'PROCESSED') {
      return this.reconcileCallback(timeoutCallback);
    }

    return {
      processed: false,
      duplicate:
        resultCallback?.status === 'PROCESSED' ||
        timeoutCallback?.status === 'PROCESSED',
      message: 'No pending M-PESA B2C callback was found.',
    };
  }

  // ===========================================================================
  // Reconciliation
  // ===========================================================================

  private async reconcileCallback(
    callbackRecord: FinancialDisbursementCallbackRecord,
  ): Promise<MpesaB2CCallbackResult> {
    const callback =
      callbackRecord.type === 'RESULT'
        ? this.normalizeResult(
            this.extractResultCallback(callbackRecord.payload),
          )
        : this.normalizeTimeout(
            this.extractTimeoutCallback(callbackRecord.payload),
          );

    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Primary lookup: OriginatorConversationID
      // -----------------------------------------------------------------------

      let aggregate =
        await this.disbursementRepository.findByProviderOriginatorConversationId(
          this.provider,
          callback.originatorConversationId,
        );

      let attempt =
        aggregate === null
          ? undefined
          : this.findMatchingAttemptByOriginatorId(
              aggregate,
              callback.originatorConversationId,
            );

      // -----------------------------------------------------------------------
      // 2. Fallback lookup: ConversationID
      // -----------------------------------------------------------------------

      if (
        (aggregate === null || attempt === undefined) &&
        callback.conversationId !== null
      ) {
        const conversationAggregate =
          await this.disbursementRepository.findByProviderConversationId(
            this.provider,
            callback.conversationId,
          );

        if (conversationAggregate !== null) {
          const conversationAttempt = this.findMatchingAttemptByConversationId(
            conversationAggregate,
            callback.conversationId,
          );

          if (conversationAttempt !== undefined) {
            // Never allow the fallback identifier to override a conflicting
            // OriginatorConversationID already assigned to this attempt.
            const existingOriginatorId =
              conversationAttempt.providerOriginatorConversationId;

            if (
              existingOriginatorId !== undefined &&
              existingOriginatorId !== callback.originatorConversationId
            ) {
              this.logger.error(
                `M-PESA B2C OriginatorConversationID mismatch for attempt "${conversationAttempt.publicId.value}".`,
              );

              return {
                processed: false,
                duplicate: false,
                disbursementPublicId: conversationAggregate.publicId.value,
                attemptPublicId: conversationAttempt.publicId.value,
                message:
                  'Callback remains pending because its OriginatorConversationID does not match the attempt.',
              };
            }

            aggregate = conversationAggregate;
            attempt = conversationAttempt;

            this.logger.warn(
              `M-PESA B2C callback matched using ConversationID fallback. OriginatorConversationID: ${callback.originatorConversationId}.`,
            );
          }
        }
      }

      // -----------------------------------------------------------------------
      // 3. Unmatched callback remains pending
      // -----------------------------------------------------------------------

      if (aggregate === null || attempt === undefined) {
        this.logger.warn(
          `M-PESA B2C ${callback.type} callback "${callback.originatorConversationId}" is awaiting disbursement reconciliation.`,
        );

        return {
          processed: false,
          duplicate: false,
          message:
            'Callback persisted and awaiting Financial Disbursement reconciliation.',
        };
      }

      // -----------------------------------------------------------------------
      // 4. Verify provider identifiers
      // -----------------------------------------------------------------------

      if (
        attempt.providerOriginatorConversationId !== undefined &&
        attempt.providerOriginatorConversationId !==
          callback.originatorConversationId
      ) {
        this.logger.error(
          `M-PESA B2C OriginatorConversationID mismatch for attempt "${attempt.publicId.value}".`,
        );

        return {
          processed: false,
          duplicate: false,
          disbursementPublicId: aggregate.publicId.value,
          attemptPublicId: attempt.publicId.value,
          message:
            'Callback remains pending because its OriginatorConversationID does not match the attempt.',
        };
      }

      if (
        callback.conversationId !== null &&
        attempt.providerConversationId !== undefined &&
        attempt.providerConversationId !== callback.conversationId
      ) {
        this.logger.error(
          `M-PESA B2C ConversationID mismatch for attempt "${attempt.publicId.value}".`,
        );

        return {
          processed: false,
          duplicate: false,
          disbursementPublicId: aggregate.publicId.value,
          attemptPublicId: attempt.publicId.value,
          message:
            'Callback remains pending because its ConversationID does not match the attempt.',
        };
      }

      if (
        callback.transactionId !== null &&
        attempt.providerTransactionId !== undefined &&
        attempt.providerTransactionId !== callback.transactionId
      ) {
        this.logger.error(
          `M-PESA B2C TransactionID mismatch for attempt "${attempt.publicId.value}".`,
        );

        return {
          processed: false,
          duplicate: false,
          disbursementPublicId: aggregate.publicId.value,
          attemptPublicId: attempt.publicId.value,
          message:
            'Callback remains pending because its TransactionID does not match the attempt.',
        };
      }

      // -----------------------------------------------------------------------
      // 5. Idempotency
      // -----------------------------------------------------------------------

      if (attempt.isTerminal()) {
        await this.callbackRepository.markProcessed(
          callbackRecord.id,
          attempt.id.toString(),
          new Date(),
        );

        return {
          processed: false,
          duplicate: true,
          disbursementPublicId: aggregate.publicId.value,
          attemptPublicId: attempt.publicId.value,
          message: 'Disbursement attempt already reached a terminal state.',
        };
      }

      // -----------------------------------------------------------------------
      // 6. Record missing provider identifiers
      // -----------------------------------------------------------------------

      const now = new Date();
      let identifiersChanged = false;

      if (attempt.providerOriginatorConversationId === undefined) {
        aggregate.setAttemptProviderOriginatorConversationId(
          attempt.publicId,
          callback.originatorConversationId,
        );

        identifiersChanged = true;
      }

      if (
        callback.conversationId !== null &&
        attempt.providerConversationId === undefined
      ) {
        aggregate.setAttemptProviderConversationId(
          attempt.publicId,
          callback.conversationId,
        );

        identifiersChanged = true;
      }

      if (
        callback.transactionId !== null &&
        attempt.providerTransactionId === undefined
      ) {
        aggregate.setAttemptProviderTransactionId(
          attempt.publicId,
          callback.transactionId,
        );

        identifiersChanged = true;
      }

      // -----------------------------------------------------------------------
      // 7. Queue timeout: preserve unresolved attempt
      // -----------------------------------------------------------------------

      if (callback.type === 'QUEUE_TIMEOUT') {
        if (identifiersChanged) {
          await this.disbursementRepository.save(aggregate);
        }

        await this.callbackRepository.markProcessed(
          callbackRecord.id,
          attempt.id.toString(),
          now,
        );

        this.logger.warn(
          `M-PESA B2C queue timeout reconciled for disbursement "${aggregate.publicId.value}". Attempt remains unresolved.`,
        );

        return {
          processed: true,
          duplicate: false,
          disbursementPublicId: aggregate.publicId.value,
          attemptPublicId: attempt.publicId.value,
          message:
            'Queue timeout recorded. Disbursement remains unresolved pending the final provider result.',
        };
      }

      // -----------------------------------------------------------------------
      // 8. Validate callback amount
      // -----------------------------------------------------------------------

      const result = this.extractResultCallback(callbackRecord.payload).Result;

      this.validateCallbackAmount(result, attempt);

      // -----------------------------------------------------------------------
      // 9. Apply final provider result to the attempt
      // -----------------------------------------------------------------------

      if (callback.resultCode === 0) {
        aggregate.succeedAttempt(attempt.publicId, now);
      } else {
        aggregate.failAttempt(
          attempt.publicId,
          String(callback.resultCode),
          this.sanitizeFailureMessage(
            callback.resultDesc ?? 'M-PESA B2C payout was unsuccessful.',
          ),
          now,
        );
      }

      // -----------------------------------------------------------------------
      // 10. Persist aggregate
      // -----------------------------------------------------------------------

      await this.disbursementRepository.save(aggregate);

      // -----------------------------------------------------------------------
      // 11. Mark callback processed
      // -----------------------------------------------------------------------

      await this.callbackRepository.markProcessed(
        callbackRecord.id,
        attempt.id.toString(),
        now,
      );

      // -----------------------------------------------------------------------
      // 12. Publish aggregate domain events
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      // -----------------------------------------------------------------------
      // 13. Return result
      // -----------------------------------------------------------------------

      this.logger.log(
        `Processed M-PESA B2C result callback for disbursement "${aggregate.publicId.value}".`,
      );

      return {
        processed: true,
        duplicate: false,
        disbursementPublicId: aggregate.publicId.value,
        attemptPublicId: attempt.publicId.value,
        message:
          callback.resultCode === 0
            ? 'M-PESA B2C payout attempt succeeded.'
            : 'M-PESA B2C payout attempt failed.',
      };
    });
  }

  // ===========================================================================
  // Callback Extraction
  // ===========================================================================

  private extractResultCallback(body: unknown): MpesaB2CResultCallback {
    if (!this.isRecord(body) || !this.isRecord(body.Result)) {
      throw new BadRequestException(
        'Invalid M-PESA B2C result callback payload.',
      );
    }

    const result = body.Result;

    if (
      typeof result.ResultType !== 'number' ||
      !Number.isSafeInteger(result.ResultType)
    ) {
      throw new Error('M-PESA B2C callback ResultType is invalid.');
    }

    if (
      typeof result.ResultCode !== 'number' &&
      typeof result.ResultCode !== 'string'
    ) {
      throw new Error('M-PESA B2C callback ResultCode is invalid.');
    }

    if (
      typeof result.ResultDesc !== 'string' ||
      typeof result.OriginatorConversationID !== 'string' ||
      typeof result.ConversationID !== 'string' ||
      typeof result.TransactionID !== 'string'
    ) {
      throw new Error(
        'M-PESA B2C result callback contains invalid identifiers or description.',
      );
    }

    if (result.ResultParameters !== undefined) {
      if (!this.isRecord(result.ResultParameters)) {
        throw new Error('M-PESA B2C ResultParameters is invalid.');
      }

      const items = result.ResultParameters.ResultParameter;

      if (
        !Array.isArray(items) ||
        !items.every(
          (item: unknown) =>
            this.isRecord(item) &&
            typeof item.Key === 'string' &&
            (item.Value === undefined ||
              item.Value === null ||
              typeof item.Value === 'string' ||
              typeof item.Value === 'number' ||
              typeof item.Value === 'boolean'),
        )
      ) {
        throw new Error('M-PESA B2C result parameters are invalid.');
      }
    }

    return body as unknown as MpesaB2CResultCallback;
  }

  private extractTimeoutCallback(body: unknown): MpesaB2CTimeoutCallback {
    if (!this.isRecord(body) || !this.isRecord(body.Result)) {
      throw new Error('Invalid M-PESA B2C queue timeout callback payload.');
    }

    const result = body.Result;

    if (typeof result.OriginatorConversationID !== 'string') {
      throw new Error(
        'M-PESA B2C timeout OriginatorConversationID is required and must be a string.',
      );
    }

    if (
      result.ConversationID !== undefined &&
      typeof result.ConversationID !== 'string'
    ) {
      throw new Error('M-PESA B2C timeout ConversationID is invalid.');
    }

    if (
      result.ResultCode !== undefined &&
      typeof result.ResultCode !== 'number' &&
      typeof result.ResultCode !== 'string'
    ) {
      throw new Error('M-PESA B2C timeout ResultCode is invalid.');
    }

    if (
      result.ResultDesc !== undefined &&
      typeof result.ResultDesc !== 'string'
    ) {
      throw new Error('M-PESA B2C timeout ResultDesc is invalid.');
    }

    return body as unknown as MpesaB2CTimeoutCallback;
  }

  // ===========================================================================
  // Normalize Result
  // ===========================================================================

  private normalizeResult(
    callback: MpesaB2CResultCallback,
  ): NormalizedB2CCallback {
    const result = callback.Result;

    const originatorConversationId = this.normalizeRequiredIdentifier(
      result.OriginatorConversationID,
      'OriginatorConversationID',
    );

    const conversationId = this.normalizeRequiredIdentifier(
      result.ConversationID,
      'ConversationID',
    );

    const transactionId = this.normalizeRequiredIdentifier(
      result.TransactionID,
      'TransactionID',
    );

    return {
      type: 'RESULT',
      originatorConversationId,
      conversationId,
      transactionId,
      resultCode: this.normalizeResultCode(result.ResultCode),
      resultDesc: this.sanitizeFailureMessage(result.ResultDesc),
    };
  }

  // ===========================================================================
  // Normalize Timeout
  // ===========================================================================

  private normalizeTimeout(
    callback: MpesaB2CTimeoutCallback,
  ): NormalizedB2CCallback {
    const result = callback.Result;

    if (result === undefined) {
      throw new Error(
        'M-PESA B2C timeout callback does not contain a Result object.',
      );
    }

    // The callback repository requires an OriginatorConversationID.
    // Never invent an identifier for an uncorrelated timeout.
    const originatorConversationId = this.normalizeRequiredIdentifier(
      result.OriginatorConversationID,
      'OriginatorConversationID',
    );

    return {
      type: 'QUEUE_TIMEOUT',
      originatorConversationId,
      conversationId: this.normalizeOptionalIdentifier(result.ConversationID),
      transactionId: null,
      resultCode:
        result.ResultCode === undefined
          ? null
          : this.normalizeResultCode(result.ResultCode),
      resultDesc:
        typeof result.ResultDesc === 'string'
          ? this.sanitizeFailureMessage(result.ResultDesc)
          : null,
    };
  }

  // ===========================================================================
  // Find Matching Attempt
  // ===========================================================================

  private findMatchingAttemptByOriginatorId(
    aggregate: FinancialDisbursementAggregate,
    originatorConversationId: string,
  ): FinancialDisbursementAttemptEntity | undefined {
    return aggregate.attempts.find(
      (attempt) =>
        attempt.provider.value === this.provider.value &&
        attempt.providerOriginatorConversationId === originatorConversationId,
    );
  }

  private findMatchingAttemptByConversationId(
    aggregate: FinancialDisbursementAggregate,
    conversationId: string,
  ): FinancialDisbursementAttemptEntity | undefined {
    return aggregate.attempts.find(
      (attempt) =>
        attempt.provider.value === this.provider.value &&
        attempt.providerConversationId === conversationId,
    );
  }

  // ===========================================================================
  // Validate Callback Amount
  // ===========================================================================

  private validateCallbackAmount(
    callback: MpesaB2CResult,
    attempt: FinancialDisbursementAttemptEntity,
  ): void {
    const amountItem = callback.ResultParameters?.ResultParameter.find(
      (item) => {
        const key = item.Key.trim().toLowerCase();

        return key === 'transactionamount' || key === 'amount';
      },
    );

    // Some failed callbacks may omit transaction amount metadata.
    if (amountItem === undefined) {
      return;
    }

    if (
      typeof amountItem.Value !== 'number' &&
      typeof amountItem.Value !== 'string'
    ) {
      throw new Error(
        'M-PESA B2C callback contains an invalid transaction amount.',
      );
    }

    const callbackAmount = Number(amountItem.Value);

    if (
      !Number.isFinite(callbackAmount) ||
      callbackAmount <= 0 ||
      !Number.isSafeInteger(callbackAmount)
    ) {
      throw new Error(
        'M-PESA B2C callback contains an invalid transaction amount.',
      );
    }

    // Financial domain amounts are stored in minor units.
    // Daraja B2C callback amounts are expressed in whole KES.
    const expectedAmountKes = attempt.amount.amount / 100;

    if (callbackAmount !== expectedAmountKes) {
      throw new Error(
        'M-PESA B2C callback amount does not match the Financial Disbursement Attempt amount.',
      );
    }
  }

  // ===========================================================================
  // Identifier Normalization
  // ===========================================================================

  private normalizeRequiredIdentifier(
    value: string | undefined,
    field: string,
  ): string {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error(`M-PESA B2C callback ${field} must not be empty.`);
    }

    return normalized;
  }

  private normalizeOptionalIdentifier(
    value: string | undefined,
  ): string | null {
    const normalized = value?.trim();

    return normalized || null;
  }

  private normalizeResultCode(value: number | string): number {
    if (typeof value === 'string' && value.trim().length === 0) {
      throw new Error(
        'M-PESA B2C callback ResultCode must be a valid integer.',
      );
    }

    const normalized = typeof value === 'number' ? value : Number(value.trim());

    if (!Number.isSafeInteger(normalized)) {
      throw new Error(
        'M-PESA B2C callback ResultCode must be a valid integer.',
      );
    }

    return normalized;
  }

  // ===========================================================================
  // Failure Message
  // ===========================================================================

  private sanitizeFailureMessage(message: string): string {
    const normalized = message.trim();

    return normalized
      ? normalized.slice(0, 500)
      : 'M-PESA B2C payout was unsuccessful.';
  }

  // ===========================================================================
  // Object Validation
  // ===========================================================================

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default MpesaB2CCallbackService;
