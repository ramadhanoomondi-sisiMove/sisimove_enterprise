// -----------------------------------------------------------------------------
// Admin Journey Completion — Filters
// -----------------------------------------------------------------------------

import type { AdminJourneyCompletionStatus } from './admin-journey-completion.enums';

// -----------------------------------------------------------------------------
// Filter State
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionFilters {
  journeyPublicId?: string;

  providerPublicId?: string;

  status?: AdminJourneyCompletionStatus;
}

// -----------------------------------------------------------------------------
// Filter Defaults
// -----------------------------------------------------------------------------

export const ADMIN_JOURNEY_COMPLETION_DEFAULT_FILTERS: AdminJourneyCompletionFilters =
  {
    journeyPublicId: undefined,
    providerPublicId: undefined,
    status: undefined,
  };

// -----------------------------------------------------------------------------
// Filter Utilities
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionFilterKey =
  keyof AdminJourneyCompletionFilters;

export type AdminJourneyCompletionFilterValue =
  AdminJourneyCompletionFilters[AdminJourneyCompletionFilterKey];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminJourneyCompletionFilters;