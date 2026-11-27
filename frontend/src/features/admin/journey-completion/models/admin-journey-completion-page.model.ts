// -----------------------------------------------------------------------------
// Admin Journey Completion — Client-side Page
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Generic Page
// -----------------------------------------------------------------------------

/**
 * Client-side pagination representation.
 *
 * This is not the response contract of the current backend list endpoint.
 */
export interface AdminJourneyCompletionPage<T> {
  items: T[];

  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}

// -----------------------------------------------------------------------------
// Page Parameters
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionPageParams {
  page: number;

  pageSize: number;
}

// -----------------------------------------------------------------------------
// Page Result
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionPageResult<T> =
  AdminJourneyCompletionPage<T>;

// -----------------------------------------------------------------------------
// Default Page Parameters
// -----------------------------------------------------------------------------

export const ADMIN_JOURNEY_COMPLETION_DEFAULT_PAGE_PARAMS: AdminJourneyCompletionPageParams =
  {
    page: 1,
    pageSize: 10,
  };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminJourneyCompletionPage;