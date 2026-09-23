// -----------------------------------------------------------------------------
// sisiMove — Journey Status
// -----------------------------------------------------------------------------
//
// Frontend representation of the Journey lifecycle.
//
// These values mirror the JourneyStatus enum exposed by the backend.
// The frontend must not invent additional lifecycle states.
//
// -----------------------------------------------------------------------------

export enum JourneyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  FULL = 'FULL',
  BOARDING = 'BOARDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETION_PENDING = 'COMPLETION_PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}