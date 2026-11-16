/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Callback Handler
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Accept raw Daraja B2C result callbacks.
 * - Accept raw Daraja B2C queue-timeout callbacks.
 * - Validate callback structures and required fields.
 * - Normalize provider payloads into typed SisiMove events.
 *
 * This handler is an adapter only.
 *
 * It MUST NOT:
 * - Access FinancialModule repositories.
 * - Persist callback records.
 * - Find or reconcile disbursements.
 * - Update disbursement or attempt statuses.
 * - Update financial accounts or balances.
 * - Publish domain events.
 * - Perform financial calculations.
 * -----------------------------------------------------------------------------
 */

import { BadRequestException, Injectable } from '@nestjs/common';

// =============================================================================
// Normalized Event Types
// =============================================================================

export interface B2CResultParameter {
  readonly key: string;
  readonly value?: string | number | boolean | null;
}

export interface B2CResultCallbackEvent {
  readonly provider: 'MPESA';
  readonly type: 'RESULT';
  readonly resultType: number;
  readonly resultCode: number;
  readonly resultDescription: string;
  readonly originatorConversationId: string;
  readonly conversationId: string;
  readonly transactionId?: string;
  readonly resultParameters?: readonly B2CResultParameter[];
}

export interface B2CQueueTimeoutCallbackEvent {
  readonly provider: 'MPESA';
  readonly type: 'QUEUE_TIMEOUT';
  readonly originatorConversationId: string;
  readonly conversationId?: string;
  readonly resultCode?: number;
  readonly resultDescription?: string;
}

export type B2CCallbackEvent =
  B2CResultCallbackEvent | B2CQueueTimeoutCallbackEvent;

interface DarajaResult {
  readonly ResultType?: unknown;
  readonly ResultCode?: unknown;
  readonly ResultDesc?: unknown;
  readonly OriginatorConversationID?: unknown;
  readonly ConversationID?: unknown;
  readonly TransactionID?: unknown;
  readonly ResultParameters?: unknown;
}

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class B2CCallbackHandler {
  // ===========================================================================
  // Process Result Callback
  // ===========================================================================

  /**
   * Validates and normalizes a final B2C result callback.
   *
   * ResultCode 0 represents provider-reported success.
   * A non-zero ResultCode represents provider-reported failure.
   *
   * FinancialModule determines the financial consequences.
   */
  public processResultCallback(body: unknown): B2CResultCallbackEvent {
    const result = this.extractResult(body);

    const resultType = this.readRequiredInteger(
      result.ResultType,
      'ResultType',
    );

    const resultCode = this.readRequiredInteger(
      result.ResultCode,
      'ResultCode',
    );

    const resultDescription = this.readRequiredString(
      result.ResultDesc,
      'ResultDesc',
    );

    const originatorConversationId = this.readRequiredString(
      result.OriginatorConversationID,
      'OriginatorConversationID',
    );

    const conversationId = this.readRequiredString(
      result.ConversationID,
      'ConversationID',
    );

    const transactionId = this.readOptionalString(
      result.TransactionID,
      'TransactionID',
    );

    if (resultCode === 0 && transactionId === undefined) {
      throw new BadRequestException(
        'Successful M-PESA B2C result callback must contain a TransactionID.',
      );
    }

    const resultParameters = this.normalizeResultParameters(
      result.ResultParameters,
    );

    return {
      provider: 'MPESA',
      type: 'RESULT',
      resultType,
      resultCode,
      resultDescription,
      originatorConversationId,
      conversationId,
      ...(transactionId !== undefined ? { transactionId } : {}),
      ...(resultParameters !== undefined ? { resultParameters } : {}),
    };
  }

  // ===========================================================================
  // Process Queue Timeout Callback
  // ===========================================================================

  /**
   * Validates and normalizes a B2C queue-timeout callback.
   *
   * A queue timeout does not establish whether the payout succeeded
   * or failed. It must not be interpreted as a failed disbursement.
   */
  public processQueueTimeoutCallback(
    body: unknown,
  ): B2CQueueTimeoutCallbackEvent {
    const result = this.extractResult(body);

    const originatorConversationId = this.readRequiredString(
      result.OriginatorConversationID,
      'OriginatorConversationID',
    );

    const conversationId = this.readOptionalString(
      result.ConversationID,
      'ConversationID',
    );

    const resultCode =
      result.ResultCode === undefined || result.ResultCode === null
        ? undefined
        : this.readInteger(result.ResultCode, 'ResultCode');

    const resultDescription =
      result.ResultDesc === undefined || result.ResultDesc === null
        ? undefined
        : this.readRequiredString(result.ResultDesc, 'ResultDesc');

    return {
      provider: 'MPESA',
      type: 'QUEUE_TIMEOUT',
      originatorConversationId,
      ...(conversationId !== undefined ? { conversationId } : {}),
      ...(resultCode !== undefined ? { resultCode } : {}),
      ...(resultDescription !== undefined ? { resultDescription } : {}),
    };
  }

  // ===========================================================================
  // Extract Callback Result
  // ===========================================================================

  private extractResult(body: unknown): DarajaResult {
    if (!this.isRecord(body)) {
      throw new BadRequestException('Invalid M-PESA B2C callback payload.');
    }

    const result = body['Result'];

    if (!this.isRecord(result)) {
      throw new BadRequestException(
        'M-PESA B2C callback Result object is missing or invalid.',
      );
    }

    return result;
  }

  // ===========================================================================
  // Normalize Result Parameters
  // ===========================================================================

  private normalizeResultParameters(
    value: unknown,
  ): readonly B2CResultParameter[] | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (!this.isRecord(value)) {
      throw new BadRequestException(
        'M-PESA B2C ResultParameters object is invalid.',
      );
    }

    const items = value['ResultParameter'];

    if (!Array.isArray(items)) {
      throw new BadRequestException(
        'M-PESA B2C ResultParameter must be an array.',
      );
    }

    return items.map((item: unknown): B2CResultParameter => {
      if (!this.isRecord(item)) {
        throw new BadRequestException(
          'M-PESA B2C result parameter is invalid.',
        );
      }

      const key = this.readRequiredString(item['Key'], 'ResultParameter.Key');

      const parameterValue = item['Value'];

      if (
        parameterValue !== undefined &&
        parameterValue !== null &&
        typeof parameterValue !== 'string' &&
        typeof parameterValue !== 'number' &&
        typeof parameterValue !== 'boolean'
      ) {
        throw new BadRequestException(
          'M-PESA B2C result parameter Value is invalid.',
        );
      }

      if (
        typeof parameterValue === 'number' &&
        !Number.isFinite(parameterValue)
      ) {
        throw new BadRequestException(
          'M-PESA B2C result parameter Value is invalid.',
        );
      }

      return {
        key,
        ...(parameterValue !== undefined ? { value: parameterValue } : {}),
      };
    });
  }

  // ===========================================================================
  // Field Validation
  // ===========================================================================

  private readRequiredString(value: unknown, field: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        `M-PESA B2C callback ${field} must be a string.`,
      );
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException(
        `M-PESA B2C callback ${field} must not be empty.`,
      );
    }

    return normalized;
  }

  private readOptionalString(
    value: unknown,
    field: string,
  ): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    return this.readRequiredString(value, field);
  }

  private readRequiredInteger(value: unknown, field: string): number {
    const normalized = this.readInteger(value, field);

    return normalized;
  }

  private readInteger(value: unknown, field: string): number {
    const normalized =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim()
          ? Number(value.trim())
          : Number.NaN;

    if (!Number.isSafeInteger(normalized)) {
      throw new BadRequestException(
        `M-PESA B2C callback ${field} must be a valid integer.`,
      );
    }

    return normalized;
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

export default B2CCallbackHandler;
