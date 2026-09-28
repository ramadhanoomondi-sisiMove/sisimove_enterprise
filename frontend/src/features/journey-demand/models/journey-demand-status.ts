// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Status Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the Journey Demand lifecycle status exposed by
// the backend HTTP/application contract.
//
// The backend remains authoritative for lifecycle transitions. The frontend
// only represents the status returned by the backend.
// -----------------------------------------------------------------------------

/**
 * Journey Demand lifecycle statuses exposed by the backend.
 */
export const JOURNEY_DEMAND_STATUSES = [
  'DRAFT',
  'OPEN',
  'MATCHED',
  'CONVERTED',
  'FULFILLED',
  'CANCELLED',
  'EXPIRED',
] as const;

/**
 * Journey Demand lifecycle status.
 */
export type JourneyDemandStatus =
  (typeof JOURNEY_DEMAND_STATUSES)[number];