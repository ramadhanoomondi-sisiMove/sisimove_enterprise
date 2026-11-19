import { BadRequestException, Injectable } from '@nestjs/common';

// =============================================================================
// Normalized Callback Types
// =============================================================================

export interface StkPushCallbackMetadataItem {
  readonly Name: string;
  readonly Value?: string | number;
}

export interface StkPushCallbackMetadata {
  readonly Item: readonly StkPushCallbackMetadataItem[];
}

/**
 * Normalized STK Push callback event.
 *
 * This is the complete application-facing representation of a Daraja callback.
 * FinancialModule persists this event in its callback inbox before attempting
 * payment correlation or reconciliation.
 *
 * This type intentionally contains provider identifiers and callback metadata
 * but no FinancialModule persistence or domain objects.
 */
export interface StkPushCallbackEvent {
  readonly provider: 'MPESA';
  readonly merchantRequestId: string;
  readonly checkoutRequestId: string;
  readonly resultCode: number;
  readonly resultDescription: string;
  readonly metadata?: StkPushCallbackMetadata;
}

// =============================================================================
// Daraja Callback Types
// =============================================================================

interface DarajaStkCallback {
  readonly MerchantRequestID: string;
  readonly CheckoutRequestID: string;
  readonly ResultCode: number;
  readonly ResultDesc: string;
  readonly CallbackMetadata?: StkPushCallbackMetadata;
}

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class StkPushCallbackHandler {
  /**
   * Validates and normalizes an M-PESA Daraja STK Push callback.
   *
   * Responsibilities:
   * 1. Validate the incoming Daraja callback envelope.
   * 2. Validate required request identifiers and result fields.
   * 3. Validate and defensively copy optional transaction metadata.
   * 4. Normalize Daraja field names into SisiMove naming conventions.
   * 5. Return a complete event for FinancialModule callback intake.
   *
   * FinancialModule is responsible for:
   * - Persisting the normalized event in a durable callback inbox.
   * - Deduplicating callback deliveries.
   * - Correlating the callback with a Financial Payment Attempt.
   * - Retaining unmatched callbacks for later recovery.
   * - Applying payment/attempt state transitions and publishing events.
   *
   * This handler deliberately does not:
   * - Persist callback records.
   * - Retrieve financial payments or payment attempts.
   * - Correlate callbacks with financial aggregates.
   * - Update payment or attempt statuses.
   * - Credit wallets or create ledger transactions.
   * - Publish financial domain events.
   * - Perform callback reconciliation.
   */
  public processCallback(body: unknown): StkPushCallbackEvent {
    const callback = this.extractCallback(body);

    return {
      provider: 'MPESA',
      merchantRequestId: callback.MerchantRequestID.trim(),
      checkoutRequestId: callback.CheckoutRequestID.trim(),
      resultCode: callback.ResultCode,
      resultDescription: callback.ResultDesc.trim(),

      ...(callback.CallbackMetadata !== undefined
        ? { metadata: this.copyCallbackMetadata(callback.CallbackMetadata) }
        : {}),
    };
  }

  // ===========================================================================
  // Daraja Payload Extraction and Validation
  // ===========================================================================

  /**
   * Validates the Daraja callback envelope:
   *
   * {
   *   Body: {
   *     stkCallback: {
   *       MerchantRequestID: string,
   *       CheckoutRequestID: string,
   *       ResultCode: number,
   *       ResultDesc: string,
   *       CallbackMetadata?: {
   *         Item: [...]
   *       }
   *     }
   *   }
   * }
   */
  private extractCallback(body: unknown): DarajaStkCallback {
    if (!this.isRecord(body)) {
      throw new BadRequestException('Invalid M-PESA callback payload.');
    }

    const callbackBody = body['Body'];

    if (!this.isRecord(callbackBody)) {
      throw new BadRequestException('Invalid M-PESA callback payload.');
    }

    const stkCallback = callbackBody['stkCallback'];

    if (!this.isRecord(stkCallback)) {
      throw new BadRequestException('Invalid M-PESA STK callback payload.');
    }

    const merchantRequestId = stkCallback['MerchantRequestID'];
    const checkoutRequestId = stkCallback['CheckoutRequestID'];
    const resultCode = stkCallback['ResultCode'];
    const resultDescription = stkCallback['ResultDesc'];
    const metadata = stkCallback['CallbackMetadata'];

    // -------------------------------------------------------------------------
    // Required field validation
    // -------------------------------------------------------------------------

    if (
      typeof merchantRequestId !== 'string' ||
      merchantRequestId.trim().length === 0 ||
      typeof checkoutRequestId !== 'string' ||
      checkoutRequestId.trim().length === 0 ||
      typeof resultCode !== 'number' ||
      !Number.isSafeInteger(resultCode) ||
      typeof resultDescription !== 'string' ||
      resultDescription.trim().length === 0
    ) {
      throw new BadRequestException(
        'M-PESA STK callback contains invalid required fields.',
      );
    }

    // -------------------------------------------------------------------------
    // Optional metadata validation
    // -------------------------------------------------------------------------

    if (metadata !== undefined && !this.isValidCallbackMetadata(metadata)) {
      throw new BadRequestException(
        'M-PESA STK callback contains invalid transaction metadata.',
      );
    }

    return {
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId,
      ResultCode: resultCode,
      ResultDesc: resultDescription,

      ...(metadata !== undefined ? { CallbackMetadata: metadata } : {}),
    };
  }

  // ===========================================================================
  // Callback Metadata Validation and Copying
  // ===========================================================================

  /**
   * Validates the optional Daraja CallbackMetadata structure.
   *
   * Successful STK callbacks normally contain transaction metadata.
   * Failed callbacks may legitimately omit it.
   */
  private isValidCallbackMetadata(
    metadata: unknown,
  ): metadata is StkPushCallbackMetadata {
    if (!this.isRecord(metadata)) {
      return false;
    }

    const items = metadata['Item'];

    if (!Array.isArray(items)) {
      return false;
    }

    return items.every((item: unknown) => {
      if (!this.isRecord(item)) {
        return false;
      }

      const name = item['Name'];
      const value = item['Value'];

      if (typeof name !== 'string' || name.trim().length === 0) {
        return false;
      }

      // Daraja metadata values are expected to be strings or numbers.
      // An absent Value is allowed; an explicitly empty string is preserved.
      if (value === undefined) {
        return true;
      }

      if (typeof value === 'string') {
        return true;
      }

      return typeof value === 'number' && Number.isFinite(value);
    });
  }

  /**
   * Creates a detached metadata object so the normalized event does not retain
   * references to the original request body's metadata array or item objects.
   */
  private copyCallbackMetadata(
    metadata: StkPushCallbackMetadata,
  ): StkPushCallbackMetadata {
    return {
      Item: metadata.Item.map((item) => ({
        Name: item.Name.trim(),
        ...(item.Value !== undefined ? { Value: item.Value } : {}),
      })),
    };
  }

  // ===========================================================================
  // Object Type Guard
  // ===========================================================================

  /**
   * Checks whether a value is a non-null, non-array object.
   */
  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

export default StkPushCallbackHandler;
