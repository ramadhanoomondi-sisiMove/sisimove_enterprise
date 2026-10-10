// src/features/journey-booking/hooks/mutations/use-authorize-journey-booking-payment.ts

// -----------------------------------------------------------------------------
// SisiMove — Authorize Journey Booking Payment Hook
// -----------------------------------------------------------------------------
//
// React Query mutation hook for authorizing payment associated with a Journey
// Booking.
//
// Responsibilities:
//
// - Expose Journey Booking payment authorization to the React UI.
// - Delegate the HTTP operation to the Journey Booking API layer.
// - Return the updated Journey Booking representation.
//
// Non-responsibilities:
//
// - HTTP request construction.
// - Payment processing.
// - Financial transaction creation.
// - Payment-provider selection.
// - Local payment-state mutation.
// - Booking lifecycle transitions.
// - UI presentation.
//
// -----------------------------------------------------------------------------

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import {
  authorizeJourneyBookingPayment,
  type AuthorizeJourneyBookingPaymentRequest,
  type AuthorizeJourneyBookingPaymentResponse,
} from '../../api';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface AuthorizeJourneyBookingPaymentVariables {
  /**
   * Public identifier of the Journey Booking.
   */
  journeyBookingPublicId: string;

  /**
   * Payment authorization request.
   */
  request: AuthorizeJourneyBookingPaymentRequest;
}

// -----------------------------------------------------------------------------
// Hook Options
// -----------------------------------------------------------------------------

export type UseAuthorizeJourneyBookingPaymentOptions<
  TError = Error,
> = Omit<
  UseMutationOptions<
    AuthorizeJourneyBookingPaymentResponse,
    TError,
    AuthorizeJourneyBookingPaymentVariables
  >,
  'mutationFn'
>;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Authorize payment associated with a Journey Booking.
 *
 * The API layer remains responsible for HTTP communication and validation.
 * This hook only exposes that operation through React Query.
 */
export function useAuthorizeJourneyBookingPayment<
  TError = Error,
>(
  options?: UseAuthorizeJourneyBookingPaymentOptions<TError>,
): UseMutationResult<
  AuthorizeJourneyBookingPaymentResponse,
  TError,
  AuthorizeJourneyBookingPaymentVariables
> {
  return useMutation<
    AuthorizeJourneyBookingPaymentResponse,
    TError,
    AuthorizeJourneyBookingPaymentVariables
  >({
    ...options,

    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }) =>
      authorizeJourneyBookingPayment(
        journeyBookingPublicId,
        request,
      ),
  });
}