// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Dispute Reason
// -----------------------------------------------------------------------------
//
// Identifies the reason a member raises a dispute against JourneyCompletion.
//
// Responsibilities:
// - represent the backend-defined dispute reason;
// - provide stable values for API/domain boundaries;
// - remain independent of presentation concerns.
//
// The frontend must not invent additional dispute reasons. The available
// values should remain aligned with the backend enum.
// -----------------------------------------------------------------------------

export enum JourneyCompletionDisputeReason {
  JOURNEY_NOT_COMPLETED = 'JOURNEY_NOT_COMPLETED',
  JOURNEY_CANCELLED = 'JOURNEY_CANCELLED',
  PASSENGER_DID_NOT_TRAVEL = 'PASSENGER_DID_NOT_TRAVEL',
  PROVIDER_DID_NOT_COMPLETE_JOURNEY = 'PROVIDER_DID_NOT_COMPLETE_JOURNEY',
  BOOKING_DISPUTE = 'BOOKING_DISPUTE',
  OTHER = 'OTHER',
}