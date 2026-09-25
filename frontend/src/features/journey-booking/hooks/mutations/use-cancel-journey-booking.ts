// -----------------------------------------------------------------------------
// Journey Booking — Cancel Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for cancelling a Journey Booking.
//
// Responsibilities:
// - expose the cancel-booking API operation to React components;
// - keep HTTP communication inside the API layer;
// - map the returned transport representation into the application model;
// - provide mutation state through React Query.
//
// Cancellation rules remain owned by the backend JourneyBooking aggregate.
// The frontend does not decide whether a booking is cancellable.
//
// The backend response is treated as the authoritative post-cancellation
// representation of the booking.
// -----------------------------------------------------------------------------

'use client';

import { useMutation } from '@tanstack/react-query';

import {
  cancelJourneyBooking,
  type CancelJourneyBookingRequest,
} from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

/**
 * Input required to cancel a Journey Booking.
 *
 * The booking public identifier identifies the resource being mutated; the
 * cancellation request contains the cancellation information sent to the
 * backend aggregate.
 */
export interface CancelJourneyBookingVariables {
  journeyBookingPublicId: string;
  request: CancelJourneyBookingRequest;
}

/**
 * Cancels a Journey Booking through the backend aggregate.
 */
export function useCancelJourneyBooking() {
  return useMutation<
    JourneyBooking,
    Error,
    CancelJourneyBookingVariables
  >({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }) => {
      const response = await cancelJourneyBooking(
        journeyBookingPublicId,
        request,
      );

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },
  });
}