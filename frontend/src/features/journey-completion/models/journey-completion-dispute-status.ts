// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Dispute Status
// -----------------------------------------------------------------------------
//
// Lifecycle status of a JourneyCompletion dispute.
//
// Responsibilities:
// - represent the persisted dispute lifecycle;
// - provide stable values for API/domain boundaries;
// - remain independent of presentation concerns.
//
// The backend owns dispute lifecycle transitions. The frontend should render
// the returned status and backend-provided capabilities rather than recreating
// transition rules locally.
// -----------------------------------------------------------------------------

export enum JourneyCompletionDisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}