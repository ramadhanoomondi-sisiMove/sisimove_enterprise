// -----------------------------------------------------------------------------
// Financial Payment Callback — Repository Contract
// -----------------------------------------------------------------------------
//
// Persistence contract for external payment provider callbacks.
//
// Responsibilities:
//
// - Persist provider callbacks durably.
// - Prevent duplicate callback records.
// - Retrieve callbacks using provider request references.
// - Track callback processing state.
// - Link processed callbacks to their payment attempts.
//
// Repository implementations must participate in the ambient UnitOfWork.
//
// -----------------------------------------------------------------------------

export type FinancialPaymentCallbackStatus = 'PENDING' | 'PROCESSED' | 'FAILED';

// =============================================================================
// Callback Record
// =============================================================================

export interface FinancialPaymentCallbackRecord {
  id: string;
  publicId: string;

  provider: string;

  merchantRequestId: string;
  checkoutRequestId: string;

  attemptId: string | null;

  resultCode: number;
  resultDesc: string;

  payload: unknown;

  status: FinancialPaymentCallbackStatus;

  receivedAt: Date;
  processedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Create Input
// =============================================================================

export interface CreateFinancialPaymentCallbackInput {
  provider: string;

  merchantRequestId: string;
  checkoutRequestId: string;

  resultCode: number;
  resultDesc: string;

  payload: unknown;
}

// =============================================================================
// Repository
// =============================================================================

export interface FinancialPaymentCallbackRepository {
  /**
   * Persist a callback if it has not already been received.
   *
   * Duplicate callbacks must not overwrite the original payload.
   */
  createIfNotExists(
    input: CreateFinancialPaymentCallbackInput,
  ): Promise<FinancialPaymentCallbackRecord>;

  /**
   * Retrieve a callback using its provider and CheckoutRequestID.
   */
  findByProviderCheckoutRequestId(
    provider: string,
    checkoutRequestId: string,
  ): Promise<FinancialPaymentCallbackRecord | null>;

  /**
   * Mark a callback as successfully processed.
   */
  markProcessed(
    callbackId: string,
    attemptId: string,
    processedAt: Date,
  ): Promise<void>;

  /**
   * Mark a callback as failed during reconciliation.
   */
  markFailed(callbackId: string): Promise<void>;
}
