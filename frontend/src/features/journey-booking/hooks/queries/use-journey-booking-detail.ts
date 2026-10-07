// -----------------------------------------------------------------------------
// Journey Booking — Detail Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for loading the detailed view of one Journey Booking by
// its public identifier.
//
// Responsibilities:
// - expose the Journey Booking detail API operation to React components;
// - provide stable query identity for caching/deduplication;
// - avoid embedding UI or domain business rules.
//
// The API adapter already returns the frontend application response model.
// No additional mapping is required here.
//
// The backend remains authoritative for booking state, ownership, and
// lifecycle rules.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { getJourneyBookingDetail } from '../../api';
import type { JourneyBookingDetailResponse } from '../../models';

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
 */
export function useJourneyBookingDetail(
  journeyBookingPublicId: string | undefined,
  options: UseJourneyBookingDetailOptions = {},
) {
  const normalizedPublicId = journeyBookingPublicId?.trim() ?? '';

  return useQuery<JourneyBookingDetailResponse, Error>({
    queryKey: [
      JOURNEY_BOOKING_DETAIL_QUERY_KEY,
      normalizedPublicId,
    ],

    queryFn: async () => {
      return getJourneyBookingDetail(normalizedPublicId);
    },

    enabled:
      options.enabled !== false &&
      normalizedPublicId.length > 0,
  });
}
