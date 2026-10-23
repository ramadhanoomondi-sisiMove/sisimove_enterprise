/**
 * sisiMove — Admin Boardings Feature
 *
 * Path:
 * src/features/admin/boardings/index.ts
 *
 * Public exports for the Admin Boardings feature.
 */

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  adminBoardingsApi,
} from './api/admin-boardings.api';

export type {
  CreateAdminBoardingRequest,
  OpenAdminBoardingRequest,
  StartAdminJourneyRequest,
  CancelAdminBoardingRequest,
  BoardAdminProviderRequest,
  BoardAdminPassengerRequest,
  MarkAdminPassengerNoShowRequest,
  WithdrawAdminBoardingParticipantRequest,
  RemoveAdminBoardingParticipantRequest,
} from './api/admin-boardings.api';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  adminBoardingQueryKeys,
  useAdminBoardings,
  useAdminBoarding,
  useAdminBoardingByJourney,
  useAdminBoardingMutations,
  useAdminBoardingFilters,
} from './hooks';

export type {
  AdminBoardingFilterValues,
  UseAdminBoardingFiltersOptions,
} from './hooks';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export * from './models';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export * from './mappers';

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

export * from './utils';
