// -----------------------------------------------------------------------------
// sisiMove — Journey Settlement Labels
// -----------------------------------------------------------------------------
//
// Human-readable presentation labels for Journey Settlement statuses.
//
// Responsibilities:
// - provide consistent settlement terminology across the UI;
// - centralize user-facing status copy.
//
// Non-responsibilities:
// - settlement lifecycle decisions;
// - financial calculations;
// - settlement orchestration.
//
// Settlement state is authoritative on the backend. These labels only
// translate known backend states into UI language.
// -----------------------------------------------------------------------------

import type { JourneySettlementStatus } from '../models/journey-settlement-status';

/**
 * User-facing labels for Journey Settlement statuses.
 */
export const JOURNEY_SETTLEMENT_STATUS_LABELS: Record<
  JourneySettlementStatus,
  string
> = {
  PENDING: 'Pending',

  SUBMITTED: 'Submitted',

  PROCESSING: 'Processing',

  COMPLETED: 'Completed',

  FAILED: 'Failed',

  HELD: 'Held',

  CANCELLED: 'Cancelled',
};

/**
 * Return the user-facing label for a Journey Settlement status.
 */
export function getJourneySettlementStatusLabel(
  status: JourneySettlementStatus,
): string {
  return JOURNEY_SETTLEMENT_STATUS_LABELS[status];
}