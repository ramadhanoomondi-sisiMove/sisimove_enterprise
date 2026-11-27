
// -----------------------------------------------------------------------------
// Admin Journey Completion — Operations
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Command Metadata
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionCommandMetadata {
  correlationId?: string;
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionCreateRequest
  extends AdminJourneyCompletionCommandMetadata {
  journeyPublicId: string;
  providerPublicId: string;
  requiredConfirmations: number;
}

// -----------------------------------------------------------------------------
// Request Completion
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionRequest
  extends AdminJourneyCompletionCommandMetadata {
  requestedAt?: string;
}

// -----------------------------------------------------------------------------
// Confirm Completion
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionConfirmRequest
  extends AdminJourneyCompletionCommandMetadata {
  confirmedAt?: string;
}

// -----------------------------------------------------------------------------
// Withdraw Confirmation
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionWithdrawConfirmationRequest
  extends AdminJourneyCompletionCommandMetadata {
  memberPublicId?: string;
}

// -----------------------------------------------------------------------------
// Cancel Completion
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionCancelRequest
  extends AdminJourneyCompletionCommandMetadata {
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// Operation Union
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionOperation =
  | {
      type: 'CREATE';
      payload: AdminJourneyCompletionCreateRequest;
    }
  | {
      type: 'REQUEST';
      journeyCompletionPublicId: string;
      payload: AdminJourneyCompletionRequest;
    }
  | {
      type: 'CONFIRM';
      journeyCompletionPublicId: string;
      payload: AdminJourneyCompletionConfirmRequest;
    }
  | {
      type: 'WITHDRAW_CONFIRMATION';
      journeyCompletionPublicId: string;
      confirmationPublicId: string;
      payload: AdminJourneyCompletionWithdrawConfirmationRequest;
    }
  | {
      type: 'CANCEL';
      journeyCompletionPublicId: string;
      payload: AdminJourneyCompletionCancelRequest;
    };
