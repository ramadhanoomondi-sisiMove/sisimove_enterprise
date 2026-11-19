/**
 * -----------------------------------------------------------------------------
 * Financial — Receive Payment Callback Service
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 *
 * - Receive normalized external payment callback events.
 * - Persist M-PESA STK Push callbacks durably.
 * - Preserve the original provider callback payload.
 * - Rely on repository idempotency to prevent duplicate callback records.
 *
 * Architecture:
 *
 * - FinancialModule owns callback persistence.
 * - The provider adapter validates and normalizes external payloads.
 * - This service does not communicate with external providers.
 * - This service does not correlate payments or attempts.
 * - This service does not process financial consequences.
 * - This service does not modify balances or payment aggregates.
 *
 * Transaction ownership remains with the application UnitOfWork.
 *
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Repository Token
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_CALLBACK_TOKENS } from '../../application/financial-payment-callback.tokens';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type {
  FinancialPaymentCallbackRepository,
  FinancialPaymentCallbackRecord,
} from '../../../financial-payment-providers/domain/repositories/financial-payment-callback.repository';

// =============================================================================
// Normalized Callback Contract
// =============================================================================
//
// This structural contract intentionally avoids importing M-PESA adapter types
// into the Financial application layer.
// =============================================================================

export interface ReceiveStkPushCallbackInput {
  provider: 'MPESA';

  merchantRequestId: string;
  checkoutRequestId: string;

  resultCode: number;
  resultDescription: string;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class ReceiveFinancialPaymentCallbackService {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_PAYMENT_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialPaymentCallbackRepository,
  ) {}

  // ===========================================================================
  // Receive STK Push Callback
  // ===========================================================================

  /**
   * Persists a normalized STK Push callback before payment correlation.
   *
   * The original provider payload is preserved separately from the normalized
   * callback fields. A callback that arrives before its payment attempt has
   * saved the provider request identifiers remains PENDING for reconciliation.
   *
   * Duplicate callbacks do not overwrite the original callback payload.
   */

  public async receiveStkPushCallback(
    event: ReceiveStkPushCallbackInput,
    originalPayload: unknown,
  ): Promise<FinancialPaymentCallbackRecord> {
    if (!event || event.provider !== 'MPESA') {
      throw new Error('Invalid M-PESA STK Push callback event.');
    }

    const merchantRequestId = event.merchantRequestId?.trim();
    const checkoutRequestId = event.checkoutRequestId?.trim();

    if (!merchantRequestId || !checkoutRequestId) {
      throw new Error('M-PESA STK callback request identifiers are required.');
    }

    if (!Number.isInteger(event.resultCode)) {
      throw new Error('M-PESA STK callback result code must be an integer.');
    }

    if (typeof event.resultDescription !== 'string') {
      throw new Error('M-PESA STK callback result description is required.');
    }

    return this.callbackRepository.createIfNotExists({
      provider: event.provider,
      merchantRequestId,
      checkoutRequestId,
      resultCode: event.resultCode,
      resultDesc: event.resultDescription.trim(),
      payload: originalPayload,
    });
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ReceiveFinancialPaymentCallbackService;
