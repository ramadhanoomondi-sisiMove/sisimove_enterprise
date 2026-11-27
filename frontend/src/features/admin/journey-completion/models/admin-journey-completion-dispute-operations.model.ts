
// -----------------------------------------------------------------------------
// Admin Journey Completion — Dispute Operations
// -----------------------------------------------------------------------------

import type {
  AdminJourneyCompletionCommandMetadata,
} from './admin-journey-completion-operations.model';
import type {
  AdminJourneyCompletionDisputeReason,
} from './admin-journey-completion.enums';
// -----------------------------------------------------------------------------
// Dispute Reason
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Open Dispute
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionOpenDisputeRequest
  extends AdminJourneyCompletionCommandMetadata {
  raisedByPublicId?: string;
  reason: AdminJourneyCompletionDisputeReason;
  description?: string;
}

// -----------------------------------------------------------------------------
// Review Dispute
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionReviewDisputeRequest
  extends AdminJourneyCompletionCommandMetadata {
  underReviewAt?: string;
}

// -----------------------------------------------------------------------------
// Resolve Dispute
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionResolveDisputeRequest
  extends AdminJourneyCompletionCommandMetadata {
  resolvedByPublicId?: string;
  resolutionSummary: string;
  resolvedAt?: string;
}

// -----------------------------------------------------------------------------
// Reject Dispute
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionRejectDisputeRequest
  extends AdminJourneyCompletionCommandMetadata {
  resolvedByPublicId?: string;
  resolutionSummary: string;
  rejectedAt?: string;
}

// -----------------------------------------------------------------------------
// Withdraw Dispute
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionWithdrawDisputeRequest
  extends AdminJourneyCompletionCommandMetadata {
  withdrawnByPublicId?: string;
  withdrawnAt?: string;
}

// -----------------------------------------------------------------------------
// Operation Union
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionDisputeOperation =
  | {
      type: 'OPEN_DISPUTE';
      journeyCompletionPublicId: string;
      payload: AdminJourneyCompletionOpenDisputeRequest;
    }
  | {
      type: 'REVIEW_DISPUTE';
      journeyCompletionPublicId: string;
      disputePublicId: string;
      payload: AdminJourneyCompletionReviewDisputeRequest;
    }
  | {
      type: 'RESOLVE_DISPUTE';
      journeyCompletionPublicId: string;
      disputePublicId: string;
      payload: AdminJourneyCompletionResolveDisputeRequest;
    }
  | {
      type: 'REJECT_DISPUTE';
      journeyCompletionPublicId: string;
      disputePublicId: string;
      payload: AdminJourneyCompletionRejectDisputeRequest;
    }
  | {
      type: 'WITHDRAW_DISPUTE';
      journeyCompletionPublicId: string;
      disputePublicId: string;
      payload: AdminJourneyCompletionWithdrawDisputeRequest;
    };
