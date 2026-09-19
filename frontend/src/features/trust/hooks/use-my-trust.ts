// -----------------------------------------------------------------------------
// sisiMove — My Trust Hook
// -----------------------------------------------------------------------------
//
// TanStack Query hook for loading the authenticated traveller's Trust profile.
//
// Architectural boundary:
//
//   Authenticated Component
//          ↓
//   useMyTrust(memberPublicId)
//          ↓
//   getTravellerTrust()
//          ↓
//   authenticatedApiClient
//          ↓
//   GET /trust-profiles/member/:memberPublicId
//          ↓
//   TravellerTrust
//
// This hook consumes the authenticated / operational Trust representation.
//
// It is intentionally different from:
//
//   useTravellerTrust()
//       ↓
//   getPublicTravellerTrust()
//       ↓
//   PublicTravellerTrust
//
// The public hook is for marketplace discovery.
// This hook is for the authenticated traveller's own Trust surface.
//
// IMPORTANT:
//
// The current backend does not expose:
//
//   GET /trust-profiles/me
//
// Therefore this hook requires the authenticated traveller's member public ID.
// Once a dedicated `/trust-profiles/me` backend query exists, this hook can be
// changed to remove the memberPublicId argument without changing its role in
// the frontend architecture.
//
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { getTravellerTrust } from '../api';
import type { TravellerTrust } from '../models/traveller-trust';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

/**
 * Stable query-key factory for authenticated traveller Trust.
 *
 * This is intentionally separate from `travellerTrustQueryKeys` used by the
 * public marketplace Trust hook.
 */
export const myTrustQueryKeys = {
  all: ['my-trust'] as const,

  byMemberPublicId: (memberPublicId: string) =>
    ['my-trust', memberPublicId] as const,
} as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Load the authenticated traveller's Trust profile.
 *
 * The query remains disabled until a usable member public ID is available.
 *
 * The API adapter uses the authenticated HTTP client, so the request is made
 * within the current authenticated session.
 */
export function useMyTrust(
  memberPublicId: string | undefined,
) {
  const normalizedMemberPublicId = memberPublicId?.trim() ?? '';

  return useQuery<TravellerTrust | null, Error>({
    queryKey:
      myTrustQueryKeys.byMemberPublicId(
        normalizedMemberPublicId,
      ),

    queryFn: () =>
      getTravellerTrust(normalizedMemberPublicId),

    enabled: normalizedMemberPublicId.length > 0,
  });
}