import { useQuery } from '@tanstack/react-query';

import { adminBoardingsApi } from '../api/admin-boardings.api';

import { adminBoardingQueryKeys } from './useAdminBoardings';

export function useAdminBoarding(publicId: string | undefined) {
  const normalizedPublicId = publicId?.trim() ?? '';

  return useQuery({
    queryKey: adminBoardingQueryKeys.detail(normalizedPublicId),

    queryFn: () =>
      adminBoardingsApi.getByPublicId(normalizedPublicId),

    enabled: normalizedPublicId.length > 0,

    staleTime: 30_000,
  });
}

export function useAdminBoardingByJourney(
  journeyPublicId: string | undefined,
) {
  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? '';

  return useQuery({
    queryKey: adminBoardingQueryKeys.byJourney(
      normalizedJourneyPublicId,
    ),

    queryFn: () =>
      adminBoardingsApi.getByJourney(normalizedJourneyPublicId),

    enabled: normalizedJourneyPublicId.length > 0,

    staleTime: 30_000,
  });
}
