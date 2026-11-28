// -----------------------------------------------------------------------------
// Admin Commission — Page Model
// -----------------------------------------------------------------------------

import type { AdminCommissionFiltersModel } from './admin-commission-filters.model';
import type { AdminCommissionQueryModel } from './admin-commission-query.model';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Frontend state for the Admin Commission page.
 *
 * This model describes page-level selection and filtering state.
 * Loading, errors, and fetched records remain owned by their respective
 * query hooks and page container.
 */
export interface AdminCommissionPageModel {
  // ===========================================================================
  // Filters
  // ===========================================================================

  readonly filters: AdminCommissionFiltersModel;

  // ===========================================================================
  // Lookup
  // ===========================================================================

  readonly activeQuery?: AdminCommissionQueryModel | null;

  // ===========================================================================
  // Selection
  // ===========================================================================

  readonly selectedCommissionPublicId?: string | null;
}