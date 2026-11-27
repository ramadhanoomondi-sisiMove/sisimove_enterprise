// -----------------------------------------------------------------------------
// Admin Journey Completion — Enums
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

export enum AdminJourneyCompletionStatus {
  PENDING = 'PENDING',
  CONFIRMATION_REQUIRED = 'CONFIRMATION_REQUIRED',
  CONFIRMED = 'CONFIRMED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Journey Completion Confirmation
// -----------------------------------------------------------------------------

export enum AdminJourneyCompletionConfirmationRole {
  PROVIDER = 'PROVIDER',
  PASSENGER = 'PASSENGER',
}

export enum AdminJourneyCompletionConfirmationStatus {
  CONFIRMED = 'CONFIRMED',
  WITHDRAWN = 'WITHDRAWN',
}

// -----------------------------------------------------------------------------
// Journey Completion Dispute
// -----------------------------------------------------------------------------

export enum AdminJourneyCompletionDisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum AdminJourneyCompletionDisputeReason {
  JOURNEY_NOT_COMPLETED = 'JOURNEY_NOT_COMPLETED',
  PASSENGER_DID_NOT_TRAVEL = 'PASSENGER_DID_NOT_TRAVEL',
  PROVIDER_DID_NOT_TRAVEL = 'PROVIDER_DID_NOT_TRAVEL',
  WRONG_DESTINATION = 'WRONG_DESTINATION',
  EARLY_TERMINATION = 'EARLY_TERMINATION',
  SAFETY_ISSUE = 'SAFETY_ISSUE',
  OTHER = 'OTHER',
}


// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminJourneyCompletionStatus;