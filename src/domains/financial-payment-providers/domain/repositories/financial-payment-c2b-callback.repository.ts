/**
 * Financial Payment C2B Callback — Repository Contract
 *
 * Persistence contract for incoming M-PESA C2B confirmation callbacks.
 *
 * Responsibilities:
 *
 * - Persist C2B callbacks durably.
 * - Prevent duplicate provider transactions.
 * - Retrieve callbacks using provider and TransID.
 * - Retrieve pending callbacks using provider and BillRefNumber.
 * - Track callback processing state.
 * - Link processed callbacks to their payment attempts.
 *
 * Repository implementations must participate in the ambient UnitOfWork.
 */

export type FinancialPaymentC2BCallbackStatus =
  'PENDING' | 'PROCESSED' | 'FAILED';

// =============================================================================
// Callback Record
// =============================================================================

export interface FinancialPaymentC2BCallbackRecord {
  id: string;
  publicId: string;

  provider: string;

  transId: string;
  billRefNumber: string | null;
  businessShortCode: string;
  transTime: string | null;

  transAmount: number;
  msisdn: string | null;

  attemptId: string | null;

  payload: unknown;

  status: FinancialPaymentC2BCallbackStatus;

  receivedAt: Date;
  processedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Create Input
// =============================================================================

export interface CreateFinancialPaymentC2BCallbackInput {
  provider: string;

  transId: string;
  billRefNumber?: string | null;
  businessShortCode: string;
  transTime?: string;

  transAmount: number;
  msisdn: string | null;

  payload: unknown;
}

// =============================================================================
// Repository
// =============================================================================

export interface FinancialPaymentC2BCallbackRepository {
  /**
   * Persist a C2B callback if it has not already been received.
   *
   * Duplicate provider transactions must not overwrite the original payload.
   */
  createIfNotExists(
    input: CreateFinancialPaymentC2BCallbackInput,
  ): Promise<FinancialPaymentC2BCallbackRecord>;

  /**
   * Retrieve a callback using its provider and M-PESA TransID.
   */
  findByProviderTransId(
    provider: string,
    transId: string,
  ): Promise<FinancialPaymentC2BCallbackRecord | null>;

  /**
   * Retrieve pending C2B callbacks matching a payment-specific BillRefNumber.
   *
   * Results must be ordered oldest first to ensure deterministic
   * reconciliation when multiple callbacks match the same reference.
   *
   * The implementation must return only callbacks belonging to the
   * specified provider and having PENDING status.
   */
  findPendingByProviderAndBillRefNumber(
    provider: string,
    billRefNumber: string,
  ): Promise<FinancialPaymentC2BCallbackRecord[]>;

  /**
   * Mark a callback as successfully processed and link its payment attempt.
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
