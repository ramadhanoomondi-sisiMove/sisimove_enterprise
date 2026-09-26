// -----------------------------------------------------------------------------
// sisiMove — Journey Settlement Status
// -----------------------------------------------------------------------------
//
// Lifecycle status of a JourneySettlement.
//
// Responsibilities:
// - represent the persisted settlement lifecycle;
// - provide stable values for API/domain boundaries;
// - remain independent of presentation concerns.
//
// Settlement processing is owned by the backend. The frontend should render
// the returned status and must not recreate settlement transitions locally.
// -----------------------------------------------------------------------------

export enum JourneySettlementStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  HELD = 'HELD',
  CANCELLED = 'CANCELLED',
}