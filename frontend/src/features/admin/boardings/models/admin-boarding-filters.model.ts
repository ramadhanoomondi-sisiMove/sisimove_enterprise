
import { AdminBoardingStatus } from './admin-boarding.enums';

// -----------------------------------------------------------------------------
// Admin Boarding Filters
// -----------------------------------------------------------------------------

export interface AdminBoardingFilters {
  search?: string;
  status?: AdminBoardingStatus | 'ALL';

  providerPublicId?: string;
  journeyId?: string;

  startedFrom?: string;
  startedTo?: string;

  createdFrom?: string;
  createdTo?: string;

  page?: number;
  limit?: number;
  sortBy?: AdminBoardingSortField;
  sortOrder?: AdminBoardingSortOrder;
}

// -----------------------------------------------------------------------------
// Sorting
// -----------------------------------------------------------------------------

export type AdminBoardingSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'boardingStartedAt'
  | 'journeyStartedAt'
  | 'cancelledAt'
  | 'status';

export type AdminBoardingSortOrder = 'asc' | 'desc';

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

export interface AdminBoardingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
