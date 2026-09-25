// -----------------------------------------------------------------------------
// Journey Booking — My Bookings Query Hook
// -----------------------------------------------------------------------------
//
// React query hook for loading Journey Bookings belonging to the currently
// authenticated passenger.
//
// The backend derives the passenger identity from the authenticated session.
// The frontend therefore does not accept or pass a passengerPublicId here.
//
// Responsibilities:
// - invoke the authenticated "mine" API operation;
// - map every transport response into the frontend JourneyBooking model;
// - provide a stable React Query cache key;
// - expose loading, error, and data state to the UI.
//
// This hook does not perform booking filtering, lifecycle decisions, or payment
// interpretation. Those concerns remain outside the query hook.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyJourneyBookings } from '../../api';
import {
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

const MY_JOURNEY_BOOKINGS_QUERY_KEY = 'my-journey-bookings';

/**
 * Loads the authenticated passenger's Journey Bookings.
 */
export function useMyJourneyBookings() {
  return useQuery<JourneyBooking[], Error>({
    queryKey: [MY_JOURNEY_BOOKINGS_QUERY_KEY],
    queryFn: async () => {
      const response = await getMyJourneyBookings();

      return mapJourneyBookings(
        response as JourneyBookingApiResponse[],
      );
    },
  });
}