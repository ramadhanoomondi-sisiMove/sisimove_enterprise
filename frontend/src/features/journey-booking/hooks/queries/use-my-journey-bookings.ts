'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyJourneyBookingDetails } from '../../api/management/get-my-journey-bookings-detail.api';

import type {
  GetMyJourneyBookingDetailsResponse,
} from '../../api/management/get-my-journey-bookings-detail.api';

const MY_JOURNEY_BOOKINGS_QUERY_KEY = 'my-journey-bookings';

export function useMyJourneyBookings() {
  return useQuery<GetMyJourneyBookingDetailsResponse, Error>({
    queryKey: [MY_JOURNEY_BOOKINGS_QUERY_KEY],
    queryFn: () => getMyJourneyBookingDetails(),
  });
}
