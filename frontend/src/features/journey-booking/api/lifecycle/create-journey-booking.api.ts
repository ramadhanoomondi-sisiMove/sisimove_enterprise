// -----------------------------------------------------------------------------
// SisiMove — Create Journey Booking API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for creating a Journey Booking.
//
// Backend endpoint:
//
//   POST /api/v1/journey-bookings
//
// Backend authorization:
//   journey-booking:create
//
// Backend command construction:
//
//   CreateJourneyBookingCommand(
//     JourneyBookingJourneyPublicId,
//     JourneyBookingPassengerPublicId,
//     JourneyBookingSeats,
//     correlationId?,
//     causationId?,
//   )
//
// The frontend sends the HTTP DTO expected by the current backend contract.
// The backend JourneyBooking aggregate remains authoritative for validating
// the Journey, passenger, seat quantity, pricing, snapshot, payment
// requirements, and booking lifecycle.
//
// IMPORTANT:
//
// The current backend controller accepts passengerPublicId from the request
// body. The authenticated API client supplies authentication credentials, but
// this adapter does not silently replace the backend contract with a
// client-derived identity. The backend should independently enforce that the
// supplied passenger belongs to the authenticated request where appropriate.
//
// Architectural responsibilities:
//
// - Define the create-booking request contract.
// - Require the authenticated API boundary.
// - Normalize and validate required primitive input.
// - Delegate booking creation to the backend.
//
// Non-responsibilities:
//
// - Determining availability.
// - Calculating pricing.
// - Creating booking snapshots.
// - Creating payment records.
// - Confirming the booking.
// - Managing authentication/session state.
// - React Query/cache management.
// - UI presentation.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Request payload accepted by the Journey Booking create endpoint.
 *
 * The shape intentionally mirrors the current HTTP DTO rather than the
 * backend command/value-object implementation.
 */
export interface CreateJourneyBookingRequest {
  /**
   * Public identifier of the Journey being booked.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the passenger making the booking.
   *
   * The current backend HTTP contract accepts this value explicitly.
   * Authorization and ownership validation remain backend responsibilities.
   */
  passengerPublicId: string;

  /**
   * Number of seats requested.
   */
  seats: number;

  /**
   * Optional correlation identifier for distributed/application tracing.
   */
  correlationId?: string;

  /**
   * Optional causation identifier for distributed/application tracing.
   */
  causationId?: string;
}

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned after Journey Booking creation.
 *
 * The backend returns the created JourneyBookingAggregate through the standard
 * JourneyBookingResponse mapper.
 */
export type CreateJourneyBookingResponse = JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Create a Journey Booking.
 *
 * Creation does not imply confirmation or successful payment. The backend
 * aggregate determines the resulting booking state and associated booking
 * components.
 *
 * @param request
 *   Primitive HTTP request data required to create the booking.
 *
 * @returns
 *   The Journey Booking returned by the backend.
 *
 * @throws
 *   TypeError when required identifiers are empty or the seat quantity is
 *   invalid at the HTTP input boundary.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the booking request.
 */
export async function createJourneyBooking(
  request: CreateJourneyBookingRequest,
): Promise<CreateJourneyBookingResponse> {
  const journeyPublicId = request.journeyPublicId.trim();
  const passengerPublicId = request.passengerPublicId.trim();

  if (!journeyPublicId) {
    throw new TypeError(
      'A Journey public identifier is required.',
    );
  }

  if (!passengerPublicId) {
    throw new TypeError(
      'A passenger public identifier is required.',
    );
  }

  if (
    !Number.isInteger(request.seats) ||
    request.seats < 1
  ) {
    throw new TypeError(
      'Journey Booking seats must be a positive integer.',
    );
  }

  return authenticatedApiClient.post<CreateJourneyBookingResponse>(
    '/journey-bookings',
    {
      journeyPublicId,
      passengerPublicId,
      seats: request.seats,
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}