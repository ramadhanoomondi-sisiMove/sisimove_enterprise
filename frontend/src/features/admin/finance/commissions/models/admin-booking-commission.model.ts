// -----------------------------------------------------------------------------
// Admin Booking Commission — Model
// -----------------------------------------------------------------------------

import type { AdminCommissionModel } from './admin-commission.model';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Represents a commercial commission charged against a passenger booking.
 *
 * Financial values and percentage are historical assessment snapshots.
 * They must not be recalculated using the current commission rule.
 */
export interface AdminBookingCommissionModel
  extends AdminCommissionModel {
  // ===========================================================================
  // Booking References
  // ===========================================================================

  readonly bookingPublicId: string;

  readonly journeyPublicId: string;
}