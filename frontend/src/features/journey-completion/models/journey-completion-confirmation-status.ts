// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Confirmation Status
// -----------------------------------------------------------------------------
//
// Lifecycle status of an individual JourneyCompletion confirmation.
//
// Responsibilities:
// - represent the persisted confirmation state;
// - provide stable values for API/domain boundaries;
// - remain independent of presentation concerns.
//
// The backend owns confirmation lifecycle transitions. The frontend should
// render the returned status and backend-provided capabilities rather than
// recreating transition rules locally.
// -----------------------------------------------------------------------------

export enum JourneyCompletionConfirmationStatus {
  CONFIRMED = 'CONFIRMED',
  WITHDRAWN = 'WITHDRAWN',
}