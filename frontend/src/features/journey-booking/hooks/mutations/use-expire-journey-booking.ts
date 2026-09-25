// -----------------------------------------------------------------------------
// Journey Booking — Expire Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for expiring a Journey Booking.
//
// Expiration is a backend-owned lifecycle transition. The frontend does not
// calculate expiration or locally change the booking status.
//
// The JourneyBooking aggregate remains authoritative for:
//
// - current booking status;
// - expiration eligibility;
// - expiration timestamp;
// - versioning;
// - domain events;
// - lifecycle invariants.
//
// The successful backend response is mapped and returned as the authoritative
// post-expiration Journey Booking representation.
// -----------------------------------------------------------------------------

'use client';

import { useMutation } from '@tanstack/react-query';

import { expireJourneyBooking } from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

/**
 * Input required to expire a Journey Booking.
 */
export interface ExpireJourneyBookingVariables {
  journeyBookingPublicId: string;
}

/**
 * Expires a Journey Booking through the backend aggregate.
 */
export function useExpireJourneyBooking() {
  return useMutation<
    JourneyBooking,
    Error,
    ExpireJourneyBookingVariables
  >({
    mutationFn: async ({
      journeyBookingPublicId,
    }) => {
      const response = await expireJourneyBooking(
        journeyBookingPublicId,
      );

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },
  });
}