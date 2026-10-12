
'use client';

// -----------------------------------------------------------------------------
// SisiMove — Journey Bookings by Passenger Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving bookings associated with one passenger.
//
// Responsibilities:
// - invoke the passenger-based discovery API;
// - map transport responses into frontend JourneyBooking models;
// - provide a stable query key containing the passenger public identifier;
// - support conditional execution.
//
// The backend remains authoritative for booking data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  findJourneyBookingsByPassenger,
} from '../../api';
import {
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

const JOURNEY_BOOKINGS_BY_PASSENGER_QUERY_KEY =
  'journey-bookings-by-passenger';

export interface UseJourneyBookingsByPassengerOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when a valid passenger identifier is supplied.
   */
  enabled?: boolean;
}

/**
 * Loads Journey Bookings associated with the supplied passenger.
 */
export function useJourneyBookingsByPassenger(
  passengerPublicId: string | undefined,
  options: UseJourneyBookingsByPassengerOptions = {},
) {
  const normalizedPassengerPublicId =
    passengerPublicId?.trim() ?? '';

  return useQuery<JourneyBooking[], Error>({
    queryKey: [
      JOURNEY_BOOKINGS_BY_PASSENGER_QUERY_KEY,
      normalizedPassengerPublicId || null,
    ],

    queryFn: async () => {
      if (!normalizedPassengerPublicId) {
        throw new TypeError(
          'A passenger public identifier is required.',
        );
      }

      const response = await findJourneyBookingsByPassenger(
        normalizedPassengerPublicId,
      );

      return mapJourneyBookings(
        response as JourneyBookingApiResponse[],
      );
    },

    enabled:
      options.enabled !== false &&
      normalizedPassengerPublicId.length > 0,
  });
}
