// -----------------------------------------------------------------------------
// Journey Booking — Create Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for creating a Journey Booking.
//
// Responsibilities:
// - expose the create-booking API operation to React components;
// - keep HTTP communication inside the API layer;
// - map the returned transport representation into the application model;
// - provide mutation state through React Query.
//
// The backend JourneyBooking aggregate remains authoritative for:
//
// - journey availability;
// - passenger eligibility;
// - seat validation;
// - booking creation;
// - pricing/snapshot requirements;
// - lifecycle state;
// - all domain invariants.
//
// This hook does not optimistically create a booking or construct a local
// booking entity before the backend confirms creation.
// -----------------------------------------------------------------------------

'use client';

import { useMutation } from '@tanstack/react-query';

import {
  createJourneyBooking,
  type CreateJourneyBookingRequest,
} from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

/**
 * Creates a Journey Booking and returns the backend-created booking.
 */
export function useCreateJourneyBooking() {
  return useMutation<
    JourneyBooking,
    Error,
    CreateJourneyBookingRequest
  >({
    mutationFn: async (request) => {
      const response = await createJourneyBooking(request);

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },
  });
}