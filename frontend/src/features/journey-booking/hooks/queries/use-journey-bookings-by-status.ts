// -----------------------------------------------------------------------------
// Journey Booking — Status Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for loading Journey Bookings by lifecycle status.
//
// This query is primarily useful for authenticated management workflows where
// a UI needs to inspect a particular booking state. The backend remains
// authoritative for the status and for determining which bookings are returned.
//
// Responsibilities:
// - invoke the status-based Journey Booking API operation;
// - map transport responses into frontend models;
// - provide a stable query key containing the requested status.
//
// This hook does not derive, filter, or transition booking statuses locally.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  findJourneyBookingsByStatus,
} from '../../api';
import {
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from '../../mappers';
import {
  type JourneyBooking,
  type JourneyBookingStatus,
} from '../../models';

const JOURNEY_BOOKINGS_BY_STATUS_QUERY_KEY =
  'journey-bookings-by-status';

export interface UseJourneyBookingsByStatusOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when a valid status is supplied.
   */
  enabled?: boolean;
}

/**
 * Loads Journey Bookings matching the supplied lifecycle status.
 */
export function useJourneyBookingsByStatus(
  status: JourneyBookingStatus | undefined,
  options: UseJourneyBookingsByStatusOptions = {},
) {
  return useQuery<JourneyBooking[], Error>({
    queryKey: [
      JOURNEY_BOOKINGS_BY_STATUS_QUERY_KEY,
      status ?? null,
    ],
    queryFn: async () => {
      if (!status) {
        throw new TypeError(
          'Journey Booking status is required.',
        );
      }

      const response =
        await findJourneyBookingsByStatus(status);

      return mapJourneyBookings(
        response as JourneyBookingApiResponse[],
      );
    },
    enabled:
      options.enabled !== false &&
      status !== undefined,
  });
}