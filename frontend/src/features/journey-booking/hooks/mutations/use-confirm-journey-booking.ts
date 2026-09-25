// -----------------------------------------------------------------------------
// Journey Booking — Confirm Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for confirming a Journey Booking.
//
// Responsibilities:
// - expose the confirm-booking API operation to React components;
// - keep HTTP communication inside the API layer;
// - map the returned transport representation into the application model;
// - provide mutation state through React Query.
//
// The backend JourneyBooking aggregate remains authoritative for confirmation.
// The frontend must not locally determine whether a booking can be confirmed.
//
// Confirmation may depend on backend-owned requirements such as:
//
// - booking lifecycle state;
// - snapshot availability;
// - pricing availability;
// - payment information;
// - aggregate invariants.
//
// A successful response is therefore always treated as the authoritative
// updated booking representation.
// -----------------------------------------------------------------------------

'use client';

import { useMutation } from '@tanstack/react-query';

import {
  confirmJourneyBooking,
  type ConfirmJourneyBookingRequest,
} from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

/**
 * Input required to confirm a Journey Booking.
 *
 * The booking public identifier is supplied separately because it identifies
 * the resource being mutated.
 */
export interface ConfirmJourneyBookingVariables {
  journeyBookingPublicId: string;
  request?: ConfirmJourneyBookingRequest;
}

/**
 * Confirms a Journey Booking through the backend aggregate.
 */
export function useConfirmJourneyBooking() {
  return useMutation<
    JourneyBooking,
    Error,
    ConfirmJourneyBookingVariables
  >({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }) => {
      const response = await confirmJourneyBooking(
        journeyBookingPublicId,
        request,
      );

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },
  });
}