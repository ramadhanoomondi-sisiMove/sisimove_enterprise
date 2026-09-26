// -----------------------------------------------------------------------------
// sisiMove — Journey Settlement Query Keys
// -----------------------------------------------------------------------------
//
// TanStack Query key factory for Journey Settlement.
//
// Settlement is deliberately kept as a separate query-key namespace from
// Journey Completion.
//
// The two resources participate in the same user-facing completion flow, but
// they remain separate backend aggregates and therefore separate frontend
// resource caches.
//
// Query-key hierarchy:
//
//     journey-settlement
//       ├── all
//       ├── lists
//       │    ├── list(filters)
//       │    └── by-completion(completionPublicId)
//       └── details
//            └── by-id(publicId)
//
// Settlement lifecycle is backend-owned. Query keys only identify cached
// server state; they do not encode or infer lifecycle transitions.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Query Filter Contracts
// -----------------------------------------------------------------------------

export interface JourneySettlementListQueryKeyFilters {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// Query Key Factory
// -----------------------------------------------------------------------------

export const journeySettlementKeys = {
  // ===========================================================================
  // Root
  // ===========================================================================

  all: ['journey-settlement'] as const,

  // ===========================================================================
  // Lists
  // ===========================================================================

  lists: () => [...journeySettlementKeys.all, 'list'] as const,

  list: (filters: JourneySettlementListQueryKeyFilters = {}) =>
    [...journeySettlementKeys.lists(), filters] as const,

  byCompletion: (completionPublicId: string) =>
    [
      ...journeySettlementKeys.lists(),
      'by-completion',
      completionPublicId,
    ] as const,

  // ===========================================================================
  // Details
  // ===========================================================================

  details: () => [...journeySettlementKeys.all, 'detail'] as const,

  byId: (journeySettlementPublicId: string) =>
    [...journeySettlementKeys.details(), journeySettlementPublicId] as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default journeySettlementKeys;