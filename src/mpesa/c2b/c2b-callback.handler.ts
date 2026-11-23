/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Callback Handler
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Accept incoming Daraja C2B callback payloads.
 * - Validate the callback structure and required fields.
 * - Normalize the provider payload into a SisiMove C2B event.
 * - Preserve the original provider payload for downstream audit processing.
 *
 * This handler is an adapter only.
 *
 * It MUST NOT:
 * - Access FinancialModule repositories.
 * - Create or update payment records.
 * - Resolve financial accounts.
 * - Perform payment matching or reconciliation.
 * - Update wallets or ledger entries.
 * - Publish domain events.
 * - Persist callback records.
 * -----------------------------------------------------------------------------
 */

import { BadRequestException, Injectable } from '@nestjs/common';

// =============================================================================
// Normalized C2B Event
// =============================================================================

export interface C2BCallbackEvent {
  readonly provider: 'MPESA';

  readonly transactionType: string;
  readonly transactionId: string;
  readonly transactionTime: string;
  readonly amount: string;
  readonly businessShortCode: string;

  /**
   * Full Kenyan payer phone number, when supplied by Safaricom.
   *
   * Safaricom Sandbox may mask the MSISDN in callback payloads.
   * A missing or masked number is therefore represented as undefined.
   */
  readonly phoneNumber?: string;

  readonly billReference?: string;
  readonly invoiceNumber?: string;
  readonly thirdPartyTransactionId?: string;

  /**
   * Original Daraja callback payload.
   *
   * Preserved without financial interpretation so FinancialModule can
   * persist the original provider payload for audit and reconciliation.
   */
  readonly rawPayload: Readonly<Record<string, unknown>>;
}

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class C2BCallbackHandler {
  // ===========================================================================
  // Process Incoming Callback
  // ===========================================================================

  public processCallback(body: unknown): C2BCallbackEvent {
    if (!this.isRecord(body)) {
      throw new BadRequestException('Invalid M-PESA C2B callback payload.');
    }

    const transactionType = this.readRequiredString(body, 'TransactionType');

    const transactionId = this.readRequiredString(body, 'TransID');

    const transactionTime = this.readRequiredString(body, 'TransTime');

    const amount = this.readRequiredString(body, 'TransAmount');

    const businessShortCode = this.readRequiredString(
      body,
      'BusinessShortCode',
    );

    // -------------------------------------------------------------------------
    // Read payer phone number.
    //
    // Safaricom Sandbox may return a masked MSISDN, for example:
    // 2547 ***** 149
    //
    // A masked number must not prevent callback processing.
    // -------------------------------------------------------------------------

    const suppliedPhoneNumber = this.readOptionalString(body, 'MSISDN');

    const phoneNumber =
      suppliedPhoneNumber && /^254(?:7|1)\d{8}$/.test(suppliedPhoneNumber)
        ? suppliedPhoneNumber
        : undefined;

    // -------------------------------------------------------------------------
    // Validate transaction type.
    // -------------------------------------------------------------------------

    if (!transactionType.trim()) {
      throw new BadRequestException('M-PESA C2B transaction type is invalid.');
    }

    // -------------------------------------------------------------------------
    // Validate transaction ID.
    // -------------------------------------------------------------------------

    if (transactionId.length > 100) {
      throw new BadRequestException('M-PESA C2B transaction ID is invalid.');
    }

    // -------------------------------------------------------------------------
    // Validate transaction time.
    //
    // Daraja format: YYYYMMDDHHmmss.
    //
    // Calendar validity is checked here, not just string shape.
    // -------------------------------------------------------------------------

    this.validateTransactionTime(transactionTime);

    // -------------------------------------------------------------------------
    // Validate transaction amount.
    //
    // Preserve the decimal string.
    // FinancialModule handles conversion to minor units.
    // -------------------------------------------------------------------------

    this.validateAmount(amount);

    // -------------------------------------------------------------------------
    // Validate business shortcode.
    // -------------------------------------------------------------------------

    if (!/^\d{5,10}$/.test(businessShortCode)) {
      throw new BadRequestException(
        'M-PESA C2B business shortcode is invalid.',
      );
    }

    // -------------------------------------------------------------------------
    // Read optional callback fields.
    // -------------------------------------------------------------------------

    const billReference = this.readOptionalString(body, 'BillRefNumber');

    const invoiceNumber = this.readOptionalString(body, 'InvoiceNumber');

    const thirdPartyTransactionId = this.readOptionalString(
      body,
      'ThirdPartyTransID',
    );

    // -------------------------------------------------------------------------
    // Preserve original callback payload.
    //
    // The payload is copied so downstream code cannot mutate the original
    // request object through this event reference.
    // -------------------------------------------------------------------------

    const rawPayload = Object.freeze({ ...body });

    // -------------------------------------------------------------------------
    // Return normalized provider event.
    // -------------------------------------------------------------------------

    return Object.freeze({
      provider: 'MPESA',
      transactionType,
      transactionId,
      transactionTime,
      amount,
      businessShortCode,

      ...(phoneNumber !== undefined ? { phoneNumber } : {}),

      ...(billReference !== undefined ? { billReference } : {}),

      ...(invoiceNumber !== undefined ? { invoiceNumber } : {}),

      ...(thirdPartyTransactionId !== undefined
        ? { thirdPartyTransactionId }
        : {}),

      rawPayload,
    });
  }

  // ===========================================================================
  // Transaction Time Validation
  // ===========================================================================

  private validateTransactionTime(value: string): void {
    if (!/^\d{14}$/.test(value)) {
      throw new BadRequestException('M-PESA C2B transaction time is invalid.');
    }

    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(8, 10));
    const minute = Number(value.slice(10, 12));
    const second = Number(value.slice(12, 14));

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    const valid =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day &&
      date.getUTCHours() === hour &&
      date.getUTCMinutes() === minute &&
      date.getUTCSeconds() === second;

    if (!valid) {
      throw new BadRequestException('M-PESA C2B transaction time is invalid.');
    }
  }

  // ===========================================================================
  // Amount Validation
  // ===========================================================================

  /**
   * Validates a positive decimal KES amount with a maximum of two decimal
   * places.
   *
   * The original string is preserved.
   * No floating-point conversion occurs.
   */
  private validateAmount(amount: string): void {
    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      throw new BadRequestException(
        'M-PESA C2B transaction amount is invalid.',
      );
    }

    const [wholePart = '0', fractionalPart = ''] = amount.split('.');

    const whole = BigInt(wholePart);

    const fraction = BigInt(fractionalPart.padEnd(2, '0'));

    const minorUnits = whole * 100n + fraction;

    if (minorUnits <= 0n) {
      throw new BadRequestException(
        'M-PESA C2B transaction amount must be positive.',
      );
    }
  }

  // ===========================================================================
  // Required Field Validation
  // ===========================================================================

  private readRequiredString(
    body: Record<string, unknown>,
    field: string,
  ): string {
    const value = body[field];

    if (
      (typeof value !== 'string' && typeof value !== 'number') ||
      (typeof value === 'number' && !Number.isFinite(value))
    ) {
      throw new BadRequestException(
        `M-PESA C2B callback field ${field} is invalid.`,
      );
    }

    const normalized = String(value).trim();

    if (!normalized) {
      throw new BadRequestException(
        `M-PESA C2B callback field ${field} is required.`,
      );
    }

    return normalized;
  }

  // ===========================================================================
  // Optional Field Validation
  // ===========================================================================

  private readOptionalString(
    body: Record<string, unknown>,
    field: string,
  ): string | undefined {
    const value = body[field];

    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new BadRequestException(
        `M-PESA C2B callback field ${field} is invalid.`,
      );
    }

    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new BadRequestException(
        `M-PESA C2B callback field ${field} is invalid.`,
      );
    }

    const normalized = String(value).trim();

    return normalized || undefined;
  }

  // ===========================================================================
  // Payload Structure Validation
  // ===========================================================================

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

export default C2BCallbackHandler;
