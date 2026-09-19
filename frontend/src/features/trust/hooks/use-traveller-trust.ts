// -----------------------------------------------------------------------------
// sisiMove — Traveller Trust Hook
// -----------------------------------------------------------------------------
//
// TanStack Query hook for loading the public Trust summary associated with a
// traveller/member.
//
// Architectural boundary:
//
//   Public Component
//          |
//          v
//   useTravellerTrust()
//          |
//          v
//   public-trust.api.ts
//          |
//          v
//   GET /trust-profiles/public/member/:memberPublicId
//          |
//          v
//   PublicTrustProfileResponse
//          |
//          v
//   PublicTravellerTrust
//
// The hook owns:
//
// - query lifecycle;
// - cache identity;
// - loading/error state;
// - enabling/disabling the query.
//
// The public Trust API adapter owns:
//
// - HTTP transport;
// - public endpoint selection;
// - transport response mapping.
//
// Consumers receive the frontend `PublicTravellerTrust` model and therefore
// remain independent of the backend TrustProfileResponse representation.
//
// IMPORTANT:
//
// This is a PUBLIC Trust hook.
//
// It MUST use:
//
//     ../api/public-trust.api
//
// rather than:
//
//     ../api
//
// because the generic API barrel also exposes the authenticated Trust API,
// where `getTravellerTrust()` has the same function name but returns:
//
//     Promise<TravellerTrust | null>
//
// The public API function returns:
//
//     Promise<PublicTravellerTrust>
//
// Keeping this import explicit prevents the authenticated and public Trust
// boundaries from being accidentally crossed.
//
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getTravellerTrust } from '../api/public-trust.api';
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