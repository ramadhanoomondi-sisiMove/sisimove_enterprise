// src/features/journey-booking/hooks/queries/use-my-journey-bookings.ts

// -----------------------------------------------------------------------------
// Journey Booking — My Bookings Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for loading detailed Journey Bookings belonging to the
// currently authenticated passenger.
//
// The backend derives the passenger identity from the authenticated session.
// The frontend therefore does not accept or pass a passengerPublicId.
//
// Responsibilities:
// - invoke the authenticated "my booking details" API operation;
// - expose JourneyBookingDetail[] to the UI;
// - provide a stable React Query cache key;
// - expose loading, error, and data state.
//
// The API adapter returns the feature detail representation directly, so no
// additional mapper is required here.
//
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getMyJourneyBookingDetails,
} from '../../api/management/get-my-journey-bookings-detail.api';

import type { JourneyBookingDetail } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

const MY_JOURNEY_BOOKINGS_QUERY_KEY = 'my-journey-bookings';

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

/**
 * Loads detailed Journey Bookings belonging to the authenticated passenger.
 *
 * The returned booking objects use JourneyBookingDetail so they can be
 * consumed directly by JourneyBookingCard and other booking-management
 * surfaces.
 */
export function useMyJourneyBookings() {
  return useQuery<readonly JourneyBookingDetail[], Error>({
    queryKey: [MY_JOURNEY_BOOKINGS_QUERY_KEY],

    queryFn: async () => {
      return getMyJourneyBookingDetails();
    },
  });
}