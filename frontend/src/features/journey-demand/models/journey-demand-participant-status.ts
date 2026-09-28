// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Status Model
// -----------------------------------------------------------------------------
//
// Represents the participant statuses exposed by the backend.
//
// Lifecycle behavior remains a backend responsibility.
// -----------------------------------------------------------------------------

/**
 * Journey Demand participant statuses exposed by the backend.
 */
export const JOURNEY_DEMAND_PARTICIPANT_STATUSES = [
  'ACTIVE',
  'WITHDRAWN',
  'REMOVED',
] as const;

/**
 * Journey Demand participant status.
 */
export type JourneyDemandParticipantStatus =
  (typeof JOURNEY_DEMAND_PARTICIPANT_STATUSES)[number];