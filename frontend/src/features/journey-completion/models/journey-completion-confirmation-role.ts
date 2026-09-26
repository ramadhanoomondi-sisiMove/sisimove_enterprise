// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Confirmation Role
// -----------------------------------------------------------------------------
//
// Identifies the participant role represented by a JourneyCompletion
// confirmation.
//
// Responsibilities:
// - represent the confirmation participant role;
// - provide stable serialized values for API/domain boundaries;
// - remain independent of presentation concerns.
//
// The backend determines which role the authenticated member represents.
// The frontend must not infer or change the role locally.
// -----------------------------------------------------------------------------

export enum JourneyCompletionConfirmationRole {
  PROVIDER = 'PROVIDER',
  PASSENGER = 'PASSENGER',
}