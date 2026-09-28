// src/features/journey/api/vehicle/attach-journey-vehicle.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Vehicle API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/vehicle
//
// The backend application layer:
// - receives primitive vehicle configuration;
// - converts values at the application/domain boundary;
// - creates the JourneyVehicleEntity;
// - asks the Journey aggregate to attach/orchestrate the vehicle;
// - enforces aggregate invariants;
// - persists the aggregate.
//
// The frontend therefore submits only the vehicle configuration accepted by
// the HTTP endpoint.
//
// The backend generates the vehicle public identifier.
// The frontend does not generate or submit it.
//
// `assetPublicId`, when supplied, is an opaque reference to the Asset bounded
// context. The frontend does not resolve or reconstruct the underlying Asset.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * HTTP input required to attach a vehicle to a Journey.
 *
 * Optional vehicle properties remain optional because the backend contract
 * explicitly permits them to be omitted.
 */
export interface AttachJourneyVehicleRequest {
  readonly make: string;
  readonly model: string;
  readonly year?: number;
  readonly color?: string;
  readonly registration?: string;
  readonly assetPublicId?: string;
}

/**
 * Attaches a vehicle to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/vehicle
 *
 * Request body:
 *   {
 *     make: string;
 *     model: string;
 *     year?: number;
 *     color?: string;
 *     registration?: string;
 *     assetPublicId?: string;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function attachJourneyVehicle(
  journeyPublicId: string,
  request: AttachJourneyVehicleRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
    request,
    options,
  );
}