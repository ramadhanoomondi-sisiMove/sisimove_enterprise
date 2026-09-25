// -----------------------------------------------------------------------------
// SisiMove — Find Journey Booking by Transaction API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for retrieving a Journey Booking associated with
// a payment/financial transaction.
//
// Backend endpoint:
//
//   GET /api/v1/journey-bookings/transaction/:transactionPublicId
//
// Backend authorization:
//   journey-booking:read
//
// The transaction identifier is an opaque cross-domain reference. The Journey
// Booking feature does not resolve or reconstruct the Financial/Transaction
// aggregate.
//
// Architectural responsibilities:
//
// - Define the HTTP contract for transaction-based discovery.
// - Require the authenticated API boundary.
// - Validate the transaction public identifier.
// - Encode the identifier safely as a URL path segment.
// - Return the backend response.
//
// Non-responsibilities:
//
// - Transaction resolution.
// - Payment processing.
// - Payment state transitions.
// - Authentication/session management.
// - React Query/cache management.
// - UI presentation.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyBooking } from '../../models/journey-booking';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Response returned by the Journey Booking transaction discovery endpoint.
 *
 * The backend returns a single JourneyBookingEntity mapped into the standard
 * JourneyBookingResponse representation.
 */
export type FindJourneyBookingByTransactionResponse =
  JourneyBooking;

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieve the Journey Booking associated with a transaction.
 *
 * @param transactionPublicId
 *   Public identifier of the Financial/Transaction-domain transaction.
 *
 * @returns
 *   The Journey Booking associated with the transaction.
 *
 * @throws
 *   TypeError when the transaction identifier is empty.
 *
 * @throws
 *   AuthenticationRequiredError when there is no authenticated session.
 *
 * @throws
 *   ApiError when the backend rejects the request.
 */
export async function findJourneyBookingByTransaction(
  transactionPublicId: string,
): Promise<FindJourneyBookingByTransactionResponse> {
  const normalizedTransactionPublicId =
    transactionPublicId.trim();

  if (!normalizedTransactionPublicId) {
    throw new TypeError(
      'A transaction public identifier is required.',
    );
  }

  return authenticatedApiClient.get<FindJourneyBookingByTransactionResponse>(
    `/journey-bookings/transaction/${encodeURIComponent(normalizedTransactionPublicId)}`,
  );
}