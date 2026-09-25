// -----------------------------------------------------------------------------
// Journey Booking — Complete Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for completing a Journey Booking.
//
// Completion is a backend-owned lifecycle transition. The frontend does not
// locally determine whether a booking is eligible for completion.
//
// The JourneyBooking aggregate remains authoritative for:
//
// - current booking status;
// - completion eligibility;
// - completion timestamp;
// - versioning;
// - domain events;
// - all lifecycle invariants.
//
// The successful backend response is mapped and returned as the authoritative
// post-completion Journey Booking representation.
// -----------------------------------------------------------------------------

'use client';

import { useMutation } from '@tanstack/react-query';

import { completeJourneyBooking } from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

/**
 * Input required to complete a Journey Booking.
 */
export interface CompleteJourneyBookingVariables {
  journeyBookingPublicId: string;
}

/**
 * Completes a Journey Booking through the backend aggregate.
 */
export function useCompleteJourneyBooking() {
  return useMutation<
    JourneyBooking,
    Error,
    CompleteJourneyBookingVariables
  >({
    mutationFn: async ({
      journeyBookingPublicId,
    }) => {
      const response = await completeJourneyBooking(
        journeyBookingPublicId,
      );

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },
  });
}