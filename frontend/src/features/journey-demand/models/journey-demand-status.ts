// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Status
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandStatus.
//
// Mirrors the backend lifecycle:
//
//     DRAFT
//     OPEN
//     MATCHED
//     CONVERTED
//     FULFILLED
//     CANCELLED
//     EXPIRED
//
// -----------------------------------------------------------------------------

export const JOURNEY_DEMAND_STATUSES = [
  'DRAFT',
  'OPEN',
  'MATCHED',
  'CONVERTED',
  'FULFILLED',
  'CANCELLED',
  'EXPIRED',
] as const;

export type JourneyDemandStatus =
  (typeof JOURNEY_DEMAND_STATUSES)[number];