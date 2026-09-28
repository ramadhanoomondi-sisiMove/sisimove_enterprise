// -----------------------------------------------------------------------------
// sisiMove — Journey Status Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for Journey lifecycle status.
//
// This model mirrors the backend JourneyStatus values exactly.
// It does NOT recreate the Journey aggregate lifecycle rules.
//
// Important:
// - The frontend may display and branch presentation around these statuses.
// - The frontend must NOT decide whether a Journey may transition between them.
// - Lifecycle transitions remain backend/application responsibilities.
// - FULL, BOARDING, and COMPLETION_PENDING are included because they are valid
//   persisted/read states even though their transitions are not currently owned
//   by the Journey lifecycle commands exposed to the frontend.
//
// -----------------------------------------------------------------------------

/**
 * Journey lifecycle/read status.
 *
 * These values correspond exactly to the backend JourneyStatus enum:
 *
 *   DRAFT
 *   PUBLISHED
 *   FULL
 *   BOARDING
 *   IN_PROGRESS
 *   COMPLETION_PENDING
 *   COMPLETED
 *   CANCELLED
 *   EXPIRED
 *
 * This is intentionally a string-literal union rather than a frontend copy
 * of the backend domain enum. The frontend consumes the HTTP representation;
 * it does not import backend domain code.
 */
export type JourneyStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'FULL'
  | 'BOARDING'
  | 'IN_PROGRESS'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

/**
 * Runtime-safe collection of all Journey status values.
 *
 * Useful for:
 * - status validation at the HTTP mapping boundary;
 * - exhaustive UI configuration;
 * - status badge configuration;
 * - select/filter options where applicable.
 *
 * Keep this list synchronized with the backend JourneyStatus contract.
 */
export const JOURNEY_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'FULL',
  'BOARDING',
  'IN_PROGRESS',
  'COMPLETION_PENDING',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
] as const satisfies readonly JourneyStatus[];

/**
 * Runtime guard for values received from the API.
 *
 * API responses are external data and therefore should not be blindly
 * asserted as JourneyStatus.
 */
export function isJourneyStatus(
  value: string,
): value is JourneyStatus {
  return (JOURNEY_STATUSES as readonly string[]).includes(value);
}