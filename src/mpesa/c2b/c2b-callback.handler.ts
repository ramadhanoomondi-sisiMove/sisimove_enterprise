/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Callback Handler
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Accept incoming Daraja C2B callback payloads.
 * - Validate the callback structure and required fields.
 * - Normalize the provider payload into a SisiMove C2B event.
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
  readonly phoneNumber: string;
  readonly billReference?: string;
  readonly invoiceNumber?: string;
  readonly thirdPartyTransactionId?: string;
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

    const phoneNumber = this.readRequiredString(body, 'MSISDN');

    // -------------------------------------------------------------------------
    // Validate transaction time.
    // -------------------------------------------------------------------------

    if (!/^\d{14}$/.test(transactionTime)) {
      throw new BadRequestException('M-PESA C2B transaction time is invalid.');
    }

    // -------------------------------------------------------------------------
    // Validate transaction amount.
    // Preserve the decimal string; FinancialModule handles money conversion.
    // -------------------------------------------------------------------------

    if (!/^\d+(\.\d{1,2})?$/.test(amount) || !/[1-9]/.test(amount)) {
      throw new BadRequestException(
        'M-PESA C2B transaction amount is invalid.',
      );
    }

    // -------------------------------------------------------------------------
    // Validate business shortcode.
    // -------------------------------------------------------------------------

    if (!/^\d+$/.test(businessShortCode)) {
      throw new BadRequestException(
        'M-PESA C2B business shortcode is invalid.',
      );
    }

    // -------------------------------------------------------------------------
    // Validate payer phone number.
    // -------------------------------------------------------------------------

    if (!/^254(?:7|1)\d{8}$/.test(phoneNumber)) {
      throw new BadRequestException(
        'M-PESA C2B payer phone number is invalid.',
      );
    }

    // -------------------------------------------------------------------------
    // Normalize the callback event.
    // -------------------------------------------------------------------------

    const billReference = this.readOptionalString(body, 'BillRefNumber');

    const invoiceNumber = this.readOptionalString(body, 'InvoiceNumber');

    const thirdPartyTransactionId = this.readOptionalString(
      body,
      'ThirdPartyTransID',
    );

    return {
      provider: 'MPESA',
      transactionType,
      transactionId,
      transactionTime,
      amount,
      businessShortCode,
      phoneNumber,
      ...(billReference !== undefined ? { billReference } : {}),
      ...(invoiceNumber !== undefined ? { invoiceNumber } : {}),
      ...(thirdPartyTransactionId !== undefined
        ? { thirdPartyTransactionId }
        : {}),
    };
  }

  // ===========================================================================
  // Field Validation
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

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

export default C2BCallbackHandler;
