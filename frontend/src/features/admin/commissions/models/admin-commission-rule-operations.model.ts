// -----------------------------------------------------------------------------
// Admin Commission Rule — Operations Model
// -----------------------------------------------------------------------------

import type { AdminCommissionType } from './admin-commission.enums';

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

/**
 * Payload for creating a commission rule.
 */
export interface AdminCreateCommissionRuleModel {
  readonly type: AdminCommissionType;

  readonly percentage: string;

  readonly effectiveFrom: string;

  readonly effectiveTo?: string | null;

  readonly version: number;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Update
// -----------------------------------------------------------------------------

/**
 * Payload for updating an existing commission rule.
 */
export interface AdminUpdateCommissionRuleModel {
  readonly type: AdminCommissionType;

  readonly percentage: string;

  readonly effectiveFrom: string;

  readonly effectiveTo?: string | null;

  readonly version: number;

  readonly updatedAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Activate
// -----------------------------------------------------------------------------

/**
 * Payload for activating a commission rule.
 */
export interface AdminActivateCommissionRuleModel {
  readonly activatedAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Deactivate
// -----------------------------------------------------------------------------

/**
 * Payload for deactivating a commission rule.
 */
export interface AdminDeactivateCommissionRuleModel {
  readonly deactivatedAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}