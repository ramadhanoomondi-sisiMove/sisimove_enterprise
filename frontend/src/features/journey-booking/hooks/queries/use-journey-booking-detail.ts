
// -----------------------------------------------------------------------------
// Journey Booking — Detail Query Hook
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { getJourneyBookingDetail } from '../../api';
import type { GetJourneyBookingDetailResponse } from '../../api';

const JOURNEY_BOOKING_DETAIL_QUERY_KEY = 'journey-booking-detail';

export interface UseJourneyBookingDetailOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when a valid booking public ID is supplied.
   */
  enabled?: boolean;
}

/**
 * Loads the detailed view of one Journey Booking.
 *
 * Returns the booking together with the backend-provided activity summary.
 * The hook does not calculate activity counts or apply domain rules.
 */
export function useJourneyBookingDetail(
  journeyBookingPublicId: string | undefined,
  options: UseJourneyBookingDetailOptions = {},
) {
  const normalizedPublicId = journeyBookingPublicId?.trim() ?? '';

  return useQuery<GetJourneyBookingDetailResponse, Error>({
    queryKey: [
      JOURNEY_BOOKING_DETAIL_QUERY_KEY,
      normalizedPublicId,
    ],

    queryFn: () => getJourneyBookingDetail(normalizedPublicId),

    enabled:
      options.enabled !== false &&
      normalizedPublicId.length > 0,
  });
}
