// -----------------------------------------------------------------------------
// Journey Booking — Confirm Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for atomically confirming a Journey Booking
// together with its payment authorization.
//
// Responsibilities:
// - expose the atomic confirm-booking API operation to React components;
// - keep HTTP communication inside the API layer;
// - map the returned transport representation into the application model;
// - provide mutation state through React Query.
//
// The backend remains authoritative for:
//
// - booking lifecycle state;
// - snapshot availability;
// - pricing availability;
// - payment information;
// - financial authorization;
// - financial holds;
// - journey capacity;
// - aggregate invariants.
//
// The frontend supplies only the payment transaction public identifier that
// was returned when the Journey Booking payment was created.
//
// A successful response is always treated as the authoritative updated
// booking representation.
//
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

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

/**
 * Input required to atomically confirm a Journey Booking.
 *
 * The booking public identifier identifies the resource being mutated.
 *
 * The request contains the payment transaction public identifier that was
 * created by the earlier Journey Booking payment step.
 */
export interface ConfirmJourneyBookingVariables {
  journeyBookingPublicId: string;
  request: ConfirmJourneyBookingRequest;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Atomically confirms a Journey Booking with payment authorization.
 *
 * The backend performs payment authorization and booking confirmation in
 * one transaction so that a capacity failure cannot leave the passenger's
 * funds held while the booking remains unconfirmed.
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
