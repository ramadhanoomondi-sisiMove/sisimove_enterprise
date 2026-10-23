/**
 * sisiMove — Admin Boardings Hooks
 *
 * Path:
 * src/features/admin/boardings/hooks/index.ts
 */

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

export {
  adminBoardingQueryKeys,
  useAdminBoardings,
} from './useAdminBoardings';

export {
  useAdminBoarding,
  useAdminBoardingByJourney,
} from './useAdminBoarding';

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

export {
  useAdminBoardingMutations,
} from './useAdminBoardingMutations';

// -----------------------------------------------------------------------------
// Filters
// -----------------------------------------------------------------------------

export {
  useAdminBoardingFilters,
} from './useAdminBoardingFilters';

export type {
  AdminBoardingFilterValues,
  UseAdminBoardingFiltersOptions,
} from './useAdminBoardingFilters';
