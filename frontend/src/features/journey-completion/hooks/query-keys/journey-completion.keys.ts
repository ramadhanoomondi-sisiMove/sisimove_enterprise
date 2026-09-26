// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Query Keys
// -----------------------------------------------------------------------------
//
// TanStack Query key factory for Journey Completion.
//
// Responsibilities:
//
// - provide stable, centralized query keys;
// - prevent ad-hoc key construction across hooks/components;
// - make targeted cache invalidation predictable;
// - preserve the hierarchy between Journey Completion resources.
//
// Non-responsibilities:
//
// - API calls;
// - domain logic;
// - authorization;
// - response mapping;
// - cache mutation.
//
// Query-key hierarchy:
//
//     journey-completion
//       ├── all
//       ├── lists
//       │    ├── list(filters)
//       │    ├── by-provider(provider, status)
//       │    └── by-status(status, provider, journey)
//       ├── details
//       │    ├── by-id(publicId)
//       │    └── by-journey(journeyPublicId)
//       ├── confirmations
//       │    ├── list(completionPublicId, filters)
//       │    └── detail(completionPublicId, confirmationPublicId)
//       └── disputes
//            ├── list(completionPublicId, filters)
//            └── detail(completionPublicId, disputePublicId)
//
// The keys use public identifiers. Internal IDs must not be introduced into
// query-key construction by the frontend.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Query Filter Contracts
// -----------------------------------------------------------------------------

export interface JourneyCompletionListQueryKeyFilters {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

export interface JourneyCompletionByProviderQueryKeyFilters {
  providerPublicId: string;
  status?: string;
}

export interface JourneyCompletionByStatusQueryKeyFilters {
  status: string;
  providerPublicId?: string;
  journeyPublicId?: string;
}

export interface JourneyCompletionConfirmationsQueryKeyFilters {
  memberPublicId?: string;
  bookingPublicId?: string;
  role?: string;
  status?: string;
}

export interface JourneyCompletionDisputesQueryKeyFilters {
  raisedByPublicId?: string;
  status?: string;
  reason?: string;
}

// -----------------------------------------------------------------------------
// Query Key Factory
// -----------------------------------------------------------------------------

export const journeyCompletionKeys = {
  // ===========================================================================
  // Root
  // ===========================================================================

  all: ['journey-completion'] as const,

  // ===========================================================================
  // Lists
  // ===========================================================================

  lists: () => [...journeyCompletionKeys.all, 'list'] as const,

  list: (filters: JourneyCompletionListQueryKeyFilters = {}) =>
    [...journeyCompletionKeys.lists(), filters] as const,

  byProvider: (
    filters: JourneyCompletionByProviderQueryKeyFilters,
  ) => [...journeyCompletionKeys.lists(), 'by-provider', filters] as const,

  byStatus: (
    filters: JourneyCompletionByStatusQueryKeyFilters,
  ) => [...journeyCompletionKeys.lists(), 'by-status', filters] as const,

  // ===========================================================================
  // Details
  // ===========================================================================

  details: () => [...journeyCompletionKeys.all, 'detail'] as const,

  byId: (journeyCompletionPublicId: string) =>
    [...journeyCompletionKeys.details(), journeyCompletionPublicId] as const,

  byJourney: (journeyPublicId: string) =>
    [...journeyCompletionKeys.details(), 'by-journey', journeyPublicId] as const,

  // ===========================================================================
  // Confirmations
  // ===========================================================================

  confirmations: () =>
    [...journeyCompletionKeys.all, 'confirmations'] as const,

  confirmationList: (
    journeyCompletionPublicId: string,
    filters: JourneyCompletionConfirmationsQueryKeyFilters = {},
  ) =>
    [
      ...journeyCompletionKeys.confirmations(),
      'list',
      journeyCompletionPublicId,
      filters,
    ] as const,

  confirmation: (
    journeyCompletionPublicId: string,
    confirmationPublicId: string,
  ) =>
    [
      ...journeyCompletionKeys.confirmations(),
      'detail',
      journeyCompletionPublicId,
      confirmationPublicId,
    ] as const,

  // ===========================================================================
  // Disputes
  // ===========================================================================

  disputes: () =>
    [...journeyCompletionKeys.all, 'disputes'] as const,

  disputeList: (
    journeyCompletionPublicId: string,
    filters: JourneyCompletionDisputesQueryKeyFilters = {},
  ) =>
    [
      ...journeyCompletionKeys.disputes(),
      'list',
      journeyCompletionPublicId,
      filters,
    ] as const,

  dispute: (
    journeyCompletionPublicId: string,
    disputePublicId: string,
  ) =>
    [
      ...journeyCompletionKeys.disputes(),
      'detail',
      journeyCompletionPublicId,
      disputePublicId,
    ] as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default journeyCompletionKeys;