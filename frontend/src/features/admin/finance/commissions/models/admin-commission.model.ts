// -----------------------------------------------------------------------------
// Admin Commission — Shared Model
// -----------------------------------------------------------------------------

import type { AdminCommissionStatus } from './admin-commission.enums';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Shared financial and lifecycle fields for booking and earning commissions.
 *
 * Monetary values and percentage represent the historical assessment
 * snapshot. They must not be recalculated from the current commission rule.
 */
export interface AdminCommissionModel {
  // ===========================================================================
  // Identity
  // ===========================================================================

  readonly publicId: string;

  // ===========================================================================
  // Commission Rule
  // ===========================================================================

  readonly commissionRulePublicId: string;

  // ===========================================================================
  // Financial Assessment Snapshot
  // ===========================================================================

  /**
   * Percentage captured when this commission was created.
   * Kept as a string to preserve the backend decimal representation.
   */
  readonly percentage: string;

  /**
   * Amount before commission, expressed in the commission currency's
   * smallest unit as supplied by the backend.
   */
  readonly baseAmount: number;

  readonly commissionAmount: number;

  readonly currency: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  readonly status: AdminCommissionStatus;

  readonly assessedAt?: string | null;

  readonly cancelledAt?: string | null;

  // ===========================================================================
  // Audit
  // ===========================================================================

  readonly createdAt: string;

  readonly updatedAt: string;
}