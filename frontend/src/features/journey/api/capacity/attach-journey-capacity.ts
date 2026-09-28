// src/features/journey/api/capacity/attach-journey-capacity.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Capacity API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/capacity
//
// The backend application layer:
// - receives the primitive capacity configuration;
// - creates the JourneyCapacityEntity;
// - asks the Journey aggregate to attach/orchestrate the capacity;
// - enforces aggregate invariants;
// - persists the aggregate.
//
// IMPORTANT:
//
// The persisted JourneyCapacity contains both:
//
//   - totalSeats
//   - bookedSeats
//
// However, bookedSeats is operational Journey state. A newly attached
// capacity is initialized by the backend with its appropriate initial
// booked-seat value.
//
// Therefore the frontend does NOT submit bookedSeats as configuration.
//
// Booking-related seat changes belong to the booking/operational domain and
// must not be fabricated as Journey capacity configuration here.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * HTTP input required to attach capacity to a Journey.
 *
 * `totalSeats` is the Journey capacity configuration supplied by the user.
 *
 * `bookedSeats` is intentionally absent. The backend owns the initial
 * operational booked-seat state.
 */
export interface AttachJourneyCapacityRequest {
  readonly totalSeats: number;
}

/**
 * Attaches capacity to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/capacity
 *
 * Request body:
 *   {
 *     totalSeats: number;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting capacity, including bookedSeats and availableSeats, should
 * be obtained through the canonical authenticated Journey query rather than
 * fabricated locally.
 */
export async function attachJourneyCapacity(
  journeyPublicId: string,
  request: AttachJourneyCapacityRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/capacity`,
    request,
    options,
  );
}