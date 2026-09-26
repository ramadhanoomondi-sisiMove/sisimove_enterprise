// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Dispute Model
// -----------------------------------------------------------------------------
//
// API-facing representation of an individual JourneyCompletion dispute.
//
// Responsibilities:
// - represent serialized backend dispute data;
// - keep API data independent from domain entities;
// - provide a stable frontend model for queries, mappers, and UI.
//
// This model intentionally contains no lifecycle methods or derived state.
// Dispute lifecycle decisions remain backend-owned.
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionDisputeReason,
} from './journey-completion-dispute-reason';

import type {
  JourneyCompletionDisputeStatus,
} from './journey-completion-dispute-status';

export interface JourneyCompletionDispute {
  /**
   * Public identifier of this dispute.
   */
  publicId: string;

  /**
   * Public identifier of the JourneyCompletion aggregate.
   */
  completionId: string;

  /**
   * Public identifier of the member who raised the dispute.
   */
  raisedByPublicId: string;

  /**
   * Backend-defined reason for the dispute.
   */
  reason: JourneyCompletionDisputeReason;

  /**
   * Optional additional explanation supplied by the member.
   */
  description?: string;

  /**
   * Current dispute lifecycle status.
   */
  status: JourneyCompletionDisputeStatus;

  /**
   * Public identifier of the member/admin who resolved or rejected
   * the dispute, when applicable.
   *
   * This is retained in the API model because it is part of the backend
   * response contract. Ordinary member UI should not expose it directly.
   */
  resolvedByPublicId?: string;

  /**
   * Optional explanation recorded when the dispute is resolved or rejected.
   */
  resolutionSummary?: string;

  /**
   * When the dispute was opened.
   */
  openedAt: string;

  /**
   * When the dispute was resolved, if applicable.
   */
  resolvedAt?: string;

  /**
   * When the dispute was rejected, if applicable.
   */
  rejectedAt?: string;

  /**
   * When the dispute was withdrawn, if applicable.
   */
  withdrawnAt?: string;

  /**
   * Persistence creation timestamp.
   */
  createdAt: string;

  /**
   * Persistence update timestamp.
   */
  updatedAt: string;
}