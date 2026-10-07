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
//   booking:create
//
// The authenticated backend controller derives passengerPublicId from the
// authenticated JWT identity. Therefore passengerPublicId MUST NOT be sent
// by the frontend.
//
// HTTP request body:
//
//   {
//     journeyPublicId,
//     seats,
//     correlationId?,
//     causationId?
//   }
//
// Backend command construction:
//
//   CreateJourneyBookingCommand(
//     JourneyBookingJourneyPublicId,
//     JourneyBookingPassengerPublicId,
//     JourneyBookingSeats,
//     correlationId,
//     causationId?,
//   )
//
// The frontend sends only the HTTP DTO accepted by the backend controller.
// The backend remains authoritative for passenger identity, Journey
// validation, seat quantity, pricing, snapshot, payment requirements, and
// booking lifecycle.
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
 * Passenger identity is intentionally NOT included.
 *
 * The backend derives passengerPublicId from the authenticated JWT identity.
 */
export interface CreateJourneyBookingRequest {
  /**
   * Public identifier of the Journey being booked.
   */
  journeyPublicId: string;

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
 * Passenger identity is supplied by the authenticated backend boundary.
 * The frontend must never provide passengerPublicId.
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
 *   TypeError when the Journey identifier is empty or the seat quantity is
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

  if (!journeyPublicId) {
    throw new TypeError(
      'A Journey public identifier is required.',
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
      seats: request.seats,
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}
