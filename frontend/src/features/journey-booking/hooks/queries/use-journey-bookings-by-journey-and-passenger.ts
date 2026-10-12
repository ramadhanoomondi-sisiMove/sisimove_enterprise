
'use client';

// -----------------------------------------------------------------------------
// SisiMove — Journey Bookings by Journey and Passenger Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving bookings matching a Journey and passenger.
//
// Responsibilities:
// - invoke the journey-and-passenger discovery API;
// - map transport responses into frontend JourneyBooking models;
// - provide a stable query key containing both identifiers;
// - support conditional execution.
//
// The backend remains authoritative for booking data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  findJourneyBookingsByJourneyAndPassenger,
} from '../../api';
import {
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

const JOURNEY_BOOKINGS_BY_JOURNEY_AND_PASSENGER_QUERY_KEY =
  'journey-bookings-by-journey-and-passenger';

export interface UseJourneyBookingsByJourneyAndPassengerOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when both identifiers are valid.
   */
  enabled?: boolean;
}

/**
 * Loads Journey Bookings matching the supplied Journey and passenger.
 */
export function useJourneyBookingsByJourneyAndPassenger(
  journeyPublicId: string | undefined,
  passengerPublicId: string | undefined,
  options: UseJourneyBookingsByJourneyAndPassengerOptions = {},
) {
  const normalizedJourneyPublicId =
    journeyPublicId?.trim() ?? '';

  const normalizedPassengerPublicId =
    passengerPublicId?.trim() ?? '';

  return useQuery<JourneyBooking[], Error>({
    queryKey: [
      JOURNEY_BOOKINGS_BY_JOURNEY_AND_PASSENGER_QUERY_KEY,
      normalizedJourneyPublicId || null,
      normalizedPassengerPublicId || null,
    ],

    queryFn: async () => {
      if (!normalizedJourneyPublicId) {
        throw new TypeError(
          'A Journey public identifier is required.',
        );
      }

      if (!normalizedPassengerPublicId) {
        throw new TypeError(
          'A passenger public identifier is required.',
        );
      }

      const response =
        await findJourneyBookingsByJourneyAndPassenger(
          normalizedJourneyPublicId,
          normalizedPassengerPublicId,
        );

      return mapJourneyBookings(
        response as JourneyBookingApiResponse[],
      );
    },

    enabled:
      options.enabled !== false &&
      normalizedJourneyPublicId.length > 0 &&
      normalizedPassengerPublicId.length > 0,
  });
}
