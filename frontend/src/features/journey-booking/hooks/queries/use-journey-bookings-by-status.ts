
'use client';

// -----------------------------------------------------------------------------
// SisiMove — Journey Bookings by Status Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving Journey Bookings by lifecycle status.
//
// Responsibilities:
// - invoke the status-based discovery API;
// - map transport responses into frontend JourneyBooking models;
// - provide a stable query key containing the requested status;
// - support conditional execution.
//
// This hook does not derive, filter, or transition booking statuses locally.
// The backend remains authoritative for booking data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  findJourneyBookingsByStatus,
} from '../../api';
import {
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type {
  JourneyBooking,
  JourneyBookingStatus,
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
  const normalizedStatus = status?.trim() ?? '';

  return useQuery<JourneyBooking[], Error>({
    queryKey: [
      JOURNEY_BOOKINGS_BY_STATUS_QUERY_KEY,
      normalizedStatus || null,
    ],

    queryFn: async () => {
      if (!normalizedStatus) {
        throw new TypeError(
          'Journey Booking status is required.',
        );
      }

      const response = await findJourneyBookingsByStatus(
        normalizedStatus as JourneyBookingStatus,
      );

      return mapJourneyBookings(
        response as JourneyBookingApiResponse[],
      );
    },

    enabled:
      options.enabled !== false &&
      normalizedStatus.length > 0,
  });
}
