/**
 * sisiMove — Admin Boardings Collection Hook
 *
 * Path:
 * src/features/admin/boardings/hooks/useAdminBoardings.ts
 *
 * Responsibilities:
 * - Fetch boarding records.
 * - Provide shared query keys for boarding queries.
 * - Keep server-state management separate from presentation.
 */

import { useQuery } from '@tanstack/react-query';

import { adminBoardingsApi } from '../api/admin-boardings.api';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminBoardingQueryKeys = {
  all: ['admin-boardings'] as const,

  lists: () => [...adminBoardingQueryKeys.all, 'list'] as const,

  list: () => [...adminBoardingQueryKeys.lists()] as const,

  details: () => [...adminBoardingQueryKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [...adminBoardingQueryKeys.details(), publicId] as const,

  byJourney: (journeyPublicId: string) =>
    [...adminBoardingQueryKeys.all, 'journey', journeyPublicId] as const,

  participants: (boardingPublicId: string) =>
    [...adminBoardingQueryKeys.all, boardingPublicId, 'participants'] as const,

  participantCount: () =>
    [...adminBoardingQueryKeys.all, 'participants', 'count'] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminBoardings() {
  return useQuery({
    queryKey: adminBoardingQueryKeys.list(),

    queryFn: () => adminBoardingsApi.getAll(),

    staleTime: 30_000,
  });
}