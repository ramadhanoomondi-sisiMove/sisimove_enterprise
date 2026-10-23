
/**
 * sisiMove — Journey Filters Model
 *
 * Types for journey directory filtering, sorting, and pagination.
 *
 * These are frontend models. API query parameter names and supported
 * filters must match the actual backend endpoint contract.
 */

import type { JourneyStatus } from '../utils/journey-status';

// -----------------------------------------------------------------------------
// Journey directory filters
// -----------------------------------------------------------------------------

export interface JourneyFilters {
  search: string;
  status: JourneyStatus | 'ALL';
  providerPublicId: string;
  departureFrom: string;
  departureTo: string;
}

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

export interface JourneyPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// -----------------------------------------------------------------------------
// Sorting
// -----------------------------------------------------------------------------

export type JourneySortDirection = 'asc' | 'desc';

export type JourneySortField =
  | 'createdAt'
  | 'updatedAt'
  | 'departureAt'
  | 'arrivalAt'
  | 'status'
  | 'originName'
  | 'destinationName';

export interface JourneySort {
  field: JourneySortField;
  direction: JourneySortDirection;
}

// -----------------------------------------------------------------------------
// Journey directory query state
// -----------------------------------------------------------------------------

export interface JourneyDirectoryQuery {
  filters: JourneyFilters;
  pagination: Pick<JourneyPagination, 'page' | 'pageSize'>;
  sort: JourneySort;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

export const DEFAULT_JOURNEY_FILTERS: JourneyFilters = {
  search: '',
  status: 'ALL',
  providerPublicId: '',
  departureFrom: '',
  departureTo: '',
};

export const DEFAULT_JOURNEY_PAGINATION: Pick<
  JourneyPagination,
  'page' | 'pageSize'
> = {
  page: 1,
  pageSize: 20,
};

export const DEFAULT_JOURNEY_SORT: JourneySort = {
  field: 'departureAt',
  direction: 'desc',
};
