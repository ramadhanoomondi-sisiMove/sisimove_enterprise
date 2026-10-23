'use client';

/**
 * sisiMove — useJourneyBookings
 *
 * Fetches bookings associated with a journey and maps backend responses
 * into frontend JourneyBooking models.
 */

import { useQuery } from '@tanstack/react-query';

import { journeyBookingsApi } from '../api/journey-bookings.api';
import { JourneyBookingResponseMapper } from '../mappers/journey-booking.mapper';

export const journeyBookingsQueryKeys = {
  all: ['journey-bookings'] as const,

  lists: () => [...journeyBookingsQueryKeys.all, 'list'] as const,

  byJourney: (journeyPublicId: string) =>
    [...journeyBookingsQueryKeys.lists(), 'journey', journeyPublicId] as const,
};

export function useJourneyBookings(journeyPublicId: string | undefined) {
  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? '';

  return useQuery({
    queryKey: journeyBookingsQueryKeys.byJourney(
      normalizedJourneyPublicId,
    ),

    queryFn: async () => {
      const responses = await journeyBookingsApi.getByJourney(
        normalizedJourneyPublicId,
      );

      return JourneyBookingResponseMapper.toModels(responses);
    },

    enabled: normalizedJourneyPublicId.length > 0,

    staleTime: 30_000,
  });
}

export default useJourneyBookings;
