// -----------------------------------------------------------------------------
// sisiMove — Traveller Trust Hook
// -----------------------------------------------------------------------------
//
// TanStack Query hook for loading the public Trust summary associated with a
// traveller/member.
//
// Architectural boundary:
//
//   Component
//      ↓
//   useTravellerTrust()
//      ↓
//   Trust API adapter
//      ↓
//   Public Trust REST endpoint
//
// The hook owns query lifecycle/state management.
// The API adapter owns HTTP transport and response mapping.
//
// Consumers receive the frontend `PublicTravellerTrust` model and therefore
// remain independent of the backend TrustProfileResponse representation.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getTravellerTrust } from '../api';
import type { PublicTravellerTrust } from '../models';


// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key factory for public traveller Trust.
 *
 * Keeping the key local to the feature prevents components from having to
 * understand TanStack Query's cache structure.
 */
export const travellerTrustQueryKeys = {
  all: ['traveller-trust'] as const,

  byMemberPublicId: (memberPublicId: string) =>
    ['traveller-trust', memberPublicId] as const,
} as const;


// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Load the public Trust summary for a traveller/member.
 *
 * The query remains disabled until a usable member public ID is available.
 *
 * This is important for marketplace cards because traveller enrichment may
 * happen only after the parent Journey/Demand read model has been loaded.
 */
export function useTravellerTrust(
  memberPublicId: string | undefined,
) {
  const normalizedMemberPublicId = memberPublicId?.trim() ?? '';

  return useQuery<PublicTravellerTrust, Error>({
    queryKey:
      travellerTrustQueryKeys.byMemberPublicId(normalizedMemberPublicId),

    queryFn: () => getTravellerTrust(normalizedMemberPublicId),

    enabled: normalizedMemberPublicId.length > 0,
  });
}
