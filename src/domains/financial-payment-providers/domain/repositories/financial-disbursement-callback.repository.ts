// -----------------------------------------------------------------------------
// Financial Disbursement Callback — Repository Contract
// -----------------------------------------------------------------------------
//
// Persistence contract for external disbursement provider callbacks.
//
// Responsibilities:
//
// - Persist provider callbacks durably.
// - Prevent duplicate callback records.
// - Preserve original callback payloads.
// - Retrieve callbacks using provider correlation references.
// - Retrieve pending callbacks for processing and recovery.
// - Track callback processing state.
// - Link processed callbacks to their disbursement attempts.
// - Prevent terminal callback states from being overwritten.
//
// Repository implementations must participate in the ambient UnitOfWork.
//
// -----------------------------------------------------------------------------

export type FinancialDisbursementCallbackType = 'RESULT' | 'QUEUE_TIMEOUT';

export type FinancialDisbursementCallbackStatus =
  'PENDING' | 'PROCESSED' | 'FAILED';

// =============================================================================
// Callback Record
// =============================================================================

export interface FinancialDisbursementCallbackRecord {
  id: string;
  publicId: string;

  provider: string;

  type: FinancialDisbursementCallbackType;

  originatorConversationId: string;
  conversationId: string | null;
  transactionId: string | null;

  attemptId: string | null;

  resultCode: number | null;
  resultDesc: string | null;

  payload: unknown;

  status: FinancialDisbursementCallbackStatus;

  receivedAt: Date;
  processedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Create Input
// =============================================================================

export interface CreateFinancialDisbursementCallbackInput {
  provider: string;

  type: FinancialDisbursementCallbackType;

  originatorConversationId: string;
  conversationId?: string | null;
  transactionId?: string | null;

  resultCode?: number | null;
  resultDesc?: string | null;

  payload: unknown;
}

// =============================================================================
// Repository
// =============================================================================

export interface FinancialDisbursementCallbackRepository {
  /**
   * Persist a callback if it has not already been received.
   *
   * Duplicate callbacks must not overwrite the original payload.
   * RESULT and QUEUE_TIMEOUT are treated as separate callback types.
   */
  createIfNotExists(
    input: CreateFinancialDisbursementCallbackInput,
  ): Promise<FinancialDisbursementCallbackRecord>;

  /**
   * Retrieve a callback using its provider, originator conversation ID,
   * and callback type.
   */
  findByProviderOriginatorConversationId(
    provider: string,
    originatorConversationId: string,
    type: FinancialDisbursementCallbackType,
  ): Promise<FinancialDisbursementCallbackRecord | null>;

  /**
   * Retrieve pending callbacks for processing or recovery.
   *
   * Results should be ordered by receivedAt ascending so older callbacks
   * are considered first.
   */
  findPending(limit: number): Promise<FinancialDisbursementCallbackRecord[]>;

  /**
   * Mark a pending callback as successfully processed and link it to
   * its disbursement attempt.
   *
   * Must only transition PENDING → PROCESSED.
   *
   * Returns true if the transition succeeded, or false if the callback
   * was no longer pending.
   */
  markProcessed(
    callbackId: string,
    attemptId: string,
    processedAt: Date,
  ): Promise<boolean>;

  /**
   * Mark a pending callback as permanently failed during reconciliation.
   *
   * Must only transition PENDING → FAILED.
   *
   * Returns true if the transition succeeded, or false if the callback
   * was no longer pending.
   */
  markFailed(callbackId: string): Promise<boolean>;
}
