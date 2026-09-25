// -----------------------------------------------------------------------------
// sisiMove — Journey Status
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the Journey lifecycle status exposed by
// the Journey HTTP API.
//
// These values intentionally mirror the frozen backend JourneyStatus enum.
//
// Backend:
//
//   DRAFT
//   PUBLISHED
//   FULL
//   BOARDING
//   IN_PROGRESS
//   COMPLETION_PENDING
//   COMPLETED
//   CANCELLED
//   EXPIRED
//
// Do not add frontend-only lifecycle states here. UI-specific presentation
// state belongs in the component layer rather than in the domain model.
//
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey.
 *
 * The status represents the Journey's current lifecycle state as exposed
 * through the Journey API.
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
 * All supported Journey statuses.
 *
 * Kept as a readonly tuple so it can be used safely for:
 *
 * - iteration
 * - validation
 * - select/filter options
 * - status guards
 * - UI mapping
 *
 * The ordering follows the backend lifecycle definition rather than a
 * preferred UI presentation order.
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
 * Runtime guard for JourneyStatus.
 *
 * Useful when converting untrusted HTTP response values into the stable
 * frontend model.
 */
export function isJourneyStatus(value: unknown): value is JourneyStatus {
  return (
    typeof value === 'string' &&
    (JOURNEY_STATUSES as readonly string[]).includes(value)
  );
}