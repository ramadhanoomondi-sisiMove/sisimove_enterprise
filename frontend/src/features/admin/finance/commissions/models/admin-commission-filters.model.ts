// -----------------------------------------------------------------------------
// Admin Commission — Filters Model
// -----------------------------------------------------------------------------

import type {
  AdminCommissionStatus,
  AdminCommissionType,
} from './admin-commission.enums';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Client-side filters for the combined commission listing.
 *
 * These filters are applied to records already fetched by the frontend.
 * They do not represent supported backend query parameters.
 */
export interface AdminCommissionFiltersModel {
  // ===========================================================================
  // Search
  // ===========================================================================

  readonly search?: string;

  // ===========================================================================
  // Classification
  // ===========================================================================

  readonly type?: AdminCommissionType;

  readonly status?: AdminCommissionStatus;

  // ===========================================================================
  // Creation Date Range
  // ===========================================================================

  readonly createdFrom?: string;

  readonly createdTo?: string;
}