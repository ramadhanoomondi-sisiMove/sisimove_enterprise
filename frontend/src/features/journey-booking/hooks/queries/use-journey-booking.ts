// -----------------------------------------------------------------------------
// Journey Booking — Query Hook
// -----------------------------------------------------------------------------
//
// React query hook for loading one Journey Booking by its public identifier.
//
// Responsibilities:
// - expose the Journey Booking API operation to React components;
// - map the transport response into the frontend application model;
// - provide stable query identity for caching/deduplication;
// - avoid embedding UI or domain business rules.
//
// The backend remains authoritative for booking state and lifecycle rules.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import { getJourneyBooking } from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

const JOURNEY_BOOKING_QUERY_KEY = 'journey-booking';

export interface UseJourneyBookingOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when a valid booking public ID is supplied.
   */
  enabled?: boolean;
}

/**
 * Loads one Journey Booking.
 */
export function useJourneyBooking(
  journeyBookingPublicId: string | undefined,
  options: UseJourneyBookingOptions = {},
) {
  const normalizedPublicId = journeyBookingPublicId?.trim() ?? '';

  return useQuery<JourneyBooking, Error>({
    queryKey: [JOURNEY_BOOKING_QUERY_KEY, normalizedPublicId],
    queryFn: async () => {
      const response =
        await getJourneyBooking(normalizedPublicId);

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },
    enabled:
      options.enabled !== false &&
      normalizedPublicId.length > 0,
  });
}