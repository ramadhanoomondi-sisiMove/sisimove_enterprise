// -----------------------------------------------------------------------------
// Admin Earning Commission — Model
// -----------------------------------------------------------------------------

import type { AdminCommissionModel } from './admin-commission.model';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Represents a commercial commission retained from a provider's earnings.
 *
 * Financial values and percentage are historical assessment snapshots.
 * netAmount is retained as a separate backend-provided value and must not
 * be recalculated by the frontend.
 */
export interface AdminEarningCommissionModel extends AdminCommissionModel {
  // ===========================================================================
  // Earning References
  // ===========================================================================

  readonly journeyPublicId: string;

  readonly settlementPublicId: string;

  readonly providerPublicId: string;

  // ===========================================================================
  // Net Earnings
  // ===========================================================================

  readonly netAmount: number;
}