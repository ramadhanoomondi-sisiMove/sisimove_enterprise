// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Status
// -----------------------------------------------------------------------------
//
// Domain lifecycle states for JourneyCompletion.
//
// Responsibilities:
// - represent the persisted completion lifecycle;
// - provide stable values shared by domain/application layers;
// - remain independent of presentation concerns.
//
// The frontend should consume the serialized status values returned by the
// backend rather than recreating lifecycle transitions locally.
// -----------------------------------------------------------------------------

export enum JourneyCompletionStatus {
  PENDING = 'PENDING',
  CONFIRMATION_REQUIRED = 'CONFIRMATION_REQUIRED',
  CONFIRMED = 'CONFIRMED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}