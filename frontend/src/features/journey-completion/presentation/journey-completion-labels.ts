// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Labels
// -----------------------------------------------------------------------------
//
// Human-readable presentation labels for Journey Completion statuses.
//
// Responsibilities:
// - provide consistent UI labels;
// - keep user-facing completion terminology centralized.
//
// Non-responsibilities:
// - lifecycle decisions;
// - status transitions;
// - API/domain logic.
//
// Backend enum values remain the source of truth. These labels are purely
// presentation copy.
// -----------------------------------------------------------------------------

import type { JourneyCompletionStatus } from '../models/journey-completion-status';

/**
 * User-facing labels for Journey Completion statuses.
 */
export const JOURNEY_COMPLETION_STATUS_LABELS: Record<
  JourneyCompletionStatus,
  string
> = {
  PENDING: 'Pending',

  CONFIRMATION_REQUIRED: 'Confirmation required',

  CONFIRMED: 'Confirmed',

  DISPUTED: 'Disputed',

  CANCELLED: 'Cancelled',
};

/**
 * Return the user-facing label for a Journey Completion status.
 */
export function getJourneyCompletionStatusLabel(
  status: JourneyCompletionStatus,
): string {
  return JOURNEY_COMPLETION_STATUS_LABELS[status];
}