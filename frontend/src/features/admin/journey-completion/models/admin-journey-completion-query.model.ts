// -----------------------------------------------------------------------------
// Admin Journey Completion — Query
// -----------------------------------------------------------------------------

import type { AdminJourneyCompletionStatus } from './admin-journey-completion.enums';

// -----------------------------------------------------------------------------
// List Query
// -----------------------------------------------------------------------------

/**
 * Query parameters supported by:
 *
 * GET /journey-completions
 *
 * The backend currently supports filtering by:
 * - journeyPublicId
 * - providerPublicId
 * - status
 *
 * Pagination and free-text search are not currently supported by this
 * endpoint.
 */
export interface AdminJourneyCompletionQuery {
  journeyPublicId?: string;

  providerPublicId?: string;

  status?: AdminJourneyCompletionStatus;
}

// -----------------------------------------------------------------------------
// Count By Status Query
// -----------------------------------------------------------------------------

/**
 * Query parameters supported by:
 *
 * GET /journey-completions/count-by-status
 */
export interface AdminJourneyCompletionCountQuery {
  status: AdminJourneyCompletionStatus;
}

// -----------------------------------------------------------------------------
// Provider Query
// -----------------------------------------------------------------------------

/**
 * Query parameters supported by:
 *
 * GET /journey-completions/by-provider
 */
export interface AdminJourneyCompletionByProviderQuery {
  providerPublicId: string;

  status?: AdminJourneyCompletionStatus;
}

// -----------------------------------------------------------------------------
// Status Query
// -----------------------------------------------------------------------------

/**
 * Query parameters supported by:
 *
 * GET /journey-completions/by-status
 */
export interface AdminJourneyCompletionByStatusQuery {
  status: AdminJourneyCompletionStatus;

  providerPublicId?: string;

  journeyPublicId?: string;
}

// -----------------------------------------------------------------------------
// Get By Public ID Query
// -----------------------------------------------------------------------------

/**
 * Query parameters supported by:
 *
 * GET /journey-completions/:journeyCompletionPublicId
 */
export interface AdminJourneyCompletionDetailQuery {
  journeyPublicId?: string;

  providerPublicId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminJourneyCompletionQuery;