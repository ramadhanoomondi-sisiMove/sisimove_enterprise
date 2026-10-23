
/**
 * sisiMove — Journey Settlement Model
 *
 * Frontend types for journey settlement API responses.
 *
 * A settlement represents the financial settlement associated with
 * a completed journey. Financial processing and settlement lifecycle
 * rules remain backend-owned.
 */

// -----------------------------------------------------------------------------
// Settlement status
// -----------------------------------------------------------------------------

export type JourneySettlementStatus = string;

// -----------------------------------------------------------------------------
// Journey settlement
// -----------------------------------------------------------------------------

export interface JourneySettlement {
  publicId: string;

  /**
   * Public identifier of the associated completion record.
   */
  completionId: string;

  /**
   * Public identifier of the associated journey.
   */
  journeyPublicId: string;

  providerPublicId: string;

  /**
   * Present when the settlement is linked to a financial transaction.
   */
  financialTransactionPublicId?: string | null;

  status: JourneySettlementStatus;

  submittedAt: string | null;
  processingAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  heldAt: string | null;
  cancelledAt: string | null;

  failureReason: string | null;

  version: number;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API response alias
// -----------------------------------------------------------------------------

export type JourneySettlementResponseModel = JourneySettlement;
