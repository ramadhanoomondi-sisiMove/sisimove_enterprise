
'use client';

// -----------------------------------------------------------------------------
// SisiMove — Journey Bookings by Journey Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving all bookings associated with one Journey.
//
// Responsibilities:
// - invoke the journey-based discovery API;
// - map transport responses into frontend JourneyBooking models;
// - provide a stable query key containing the Journey public identifier;
// - support conditional execution.
//
// The backend remains authoritative for booking data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  findJourneyBookingsByJourney,
} from '../../api';
import {
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

const JOURNEY_BOOKINGS_BY_JOURNEY_QUERY_KEY =
  'journey-bookings-by-journey';

export interface UseJourneyBookingsByJourneyOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when a valid Journey identifier is supplied.
   */
  enabled?: boolean;
}

/**
 * Loads all Journey Bookings associated with the supplied Journey.
 */
export function useJourneyBookingsByJourney(
  journeyPublicId: string | undefined,
  options: UseJourneyBookingsByJourneyOptions = {},
) {
  const normalizedJourneyPublicId =
    journeyPublicId?.trim() ?? '';

  return useQuery<JourneyBooking[], Error>({
    queryKey: [
      JOURNEY_BOOKINGS_BY_JOURNEY_QUERY_KEY,
      normalizedJourneyPublicId || null,
    ],

    queryFn: async () => {
      if (!normalizedJourneyPublicId) {
        throw new TypeError(
          'A Journey public identifier is required.',
        );
      }

      const response = await findJourneyBookingsByJourney(
        normalizedJourneyPublicId,
      );

      return mapJourneyBookings(
        response as JourneyBookingApiResponse[],
      );
    },

    enabled:
      options.enabled !== false &&
      normalizedJourneyPublicId.length > 0,
  });
}
