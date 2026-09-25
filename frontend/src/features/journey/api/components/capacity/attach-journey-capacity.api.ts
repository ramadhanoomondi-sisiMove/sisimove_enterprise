// -----------------------------------------------------------------------------
// sisiMove — Attach / Configure Journey Capacity API
// -----------------------------------------------------------------------------
//
// HTTP adapter for configuring the passenger capacity of a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/capacity
//
// Request body:
//
//   {
//     totalSeats: number;
//     bookedSeats: number;
//   }
//
// The Journey application handler owns the creation/configuration workflow:
//
//   1. Resolve the Journey aggregate.
//   2. Create the JourneyCapacity entity from the request.
//   3. Attach the capacity to the Journey aggregate.
//   4. Persist the Journey aggregate.
//
// Architectural boundary:
//
//   Seats Form
//       │
//       ▼
//   attachJourneyCapacity()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/capacity
//       │
//       ▼
//   AttachJourneyCapacityCommand
//       │
//       ▼
//   Journey Aggregate
//
// This adapter does NOT:
// - create domain entities;
// - generate capacity public identifiers;
// - calculate booked seats;
// - validate Journey lifecycle rules;
// - persist the Journey;
// - navigate;
// - manage React Query state.
//
// The backend owns capacity validation, seat invariants, lifecycle rules,
// Journey association, and aggregate persistence.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Request accepted by the configure Journey capacity endpoint.
 *
 * These are transport-level fields required by the backend command.
 *
 * The backend owns capacity creation, validation, Journey association,
// * lifecycle rules, and aggregate persistence.
 */
export interface AttachJourneyCapacityRequest {
  /**
   * Total number of passenger seats available on the Journey.
   */
  totalSeats: number;

  /**
   * Number of passenger seats already booked.
   *
   * For a newly created Journey this should normally be zero.
   */
  bookedSeats: number;
}

/**
 * Configure and attach capacity to a Journey.
 *
 * The backend creates the JourneyCapacity entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Capacity configuration data.
 */
export async function attachJourneyCapacity(
  journeyPublicId: string,
  request: AttachJourneyCapacityRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/capacity`,
    request,
  );
}