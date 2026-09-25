// -----------------------------------------------------------------------------
// sisiMove — Attach / Configure Journey Vehicle API
// -----------------------------------------------------------------------------
//
// HTTP adapter for configuring the vehicle used by a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/vehicle
//
// Request body:
//
//   {
//     make: string;
//     model: string;
//     year?: number;
//     color?: string;
//     registration?: string;
//     assetPublicId?: string;
//   }
//
// The Journey application handler owns the creation/configuration workflow:
//
//   1. Resolve the Journey aggregate.
//   2. Create/configure the JourneyVehicle entity from the request.
//   3. Attach the vehicle to the Journey aggregate.
//   4. Persist the Journey aggregate.
//
// Architectural boundary:
//
//   Vehicle Form
//       │
//       ▼
//   attachJourneyVehicle()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/vehicle
//       │
//       ▼
//   AttachJourneyVehicleCommand
//       │
//       ▼
//   Journey Aggregate
//
// This adapter does NOT:
// - create domain entities;
// - generate vehicle identifiers;
// - resolve vehicle ownership;
// - validate Journey lifecycle rules;
// - persist the Journey;
// - navigate;
// - manage React Query state.
//
// If assetPublicId is supplied, it is an external Asset reference. The
// frontend does not create or resolve the Asset through this adapter.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

/**
 * Request accepted by the configure Journey vehicle endpoint.
 *
 * These are transport-level fields required by the backend command.
 *
 * The backend owns vehicle creation/configuration, validation, Journey
 * association, lifecycle rules, and aggregate persistence.
 */
export interface AttachJourneyVehicleRequest {
  /**
   * Vehicle manufacturer.
   */
  make: string;

  /**
   * Vehicle model.
   */
  model: string;

  /**
   * Optional vehicle model year.
   */
  year?: number;

  /**
   * Optional vehicle colour.
   */
  color?: string;

  /**
   * Optional vehicle registration number.
   */
  registration?: string;

  /**
   * Optional public identifier of an existing Asset representing the vehicle.
   */
  assetPublicId?: string;
}

/**
 * Configure and attach a vehicle to a Journey.
 *
 * The backend creates/configures the JourneyVehicle entity, attaches it to
 * the Journey aggregate, and persists the aggregate.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Vehicle configuration data.
 */
export async function attachJourneyVehicle(
  journeyPublicId: string,
  request: AttachJourneyVehicleRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
    request,
  );
}