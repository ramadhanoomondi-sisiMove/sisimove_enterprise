// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Status
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandParticipantStatus.
//
// Mirrors the backend enum:
//
//     ACTIVE
//     WITHDRAWN
//     REMOVED
//
// -----------------------------------------------------------------------------

export const JOURNEY_DEMAND_PARTICIPANT_STATUSES = [
  'ACTIVE',
  'WITHDRAWN',
  'REMOVED',
] as const;

export type JourneyDemandParticipantStatus =
  (typeof JOURNEY_DEMAND_PARTICIPANT_STATUSES)[number];