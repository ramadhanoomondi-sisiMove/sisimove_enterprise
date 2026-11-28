// -----------------------------------------------------------------------------
// Admin Commission Rule — Model
// -----------------------------------------------------------------------------

import type { AdminCommissionType } from './admin-commission.enums';
import type { AdminCommissionRuleStatus } from './admin-commission-rule.enums';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Represents a commercial commission rule.
 *
 * The rule defines the commission type, percentage, lifecycle status,
 * effective period, and version.
 *
 * Version information allows commission policies to remain traceable.
 */
export interface AdminCommissionRuleModel {
  // ===========================================================================
  // Identity
  // ===========================================================================

  readonly publicId: string;

  // ===========================================================================
  // Commission Definition
  // ===========================================================================

  readonly type: AdminCommissionType;

  /**
   * Percentage stored as a string to preserve the backend decimal value.
   */
  readonly percentage: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  readonly status: AdminCommissionRuleStatus;

  // ===========================================================================
  // Effective Period
  // ===========================================================================

  readonly effectiveFrom: string;

  readonly effectiveTo?: string | null;

  // ===========================================================================
  // Version
  // ===========================================================================

  readonly version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  readonly createdAt: string;

  readonly updatedAt: string;
}