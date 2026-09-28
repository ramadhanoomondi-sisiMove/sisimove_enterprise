// src/features/journey/api/journeys/create-journey.ts

// -----------------------------------------------------------------------------
// sisiMove — Create Journey API
// -----------------------------------------------------------------------------
//
// This API mirrors:
//
//   POST /journeys
//
// The authenticated backend derives the provider identity from the current
// session. The frontend therefore does not submit providerPublicId.
//
// The backend also generates the journey public identifier and correlation
// identifier. Neither is a frontend input.
//
// NOTE:
// The controller currently returns JourneyAggregate directly. Until the
// aggregate's HTTP serialization/accessor shape is confirmed, this API should
// not invent a response DTO.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * Creates an empty Journey draft for the authenticated provider.
 *
 * Backend:
 *   POST /journeys
 *
 * Request body:
 *   none
 *
 * Authorization:
 *   authenticated session + journey:create permission
 *
 * The newly created Journey starts in DRAFT state and is progressively
 * assembled through the Journey component mutation APIs.
 */
export async function createJourney(
  options: RequestOptions = {},
): Promise<unknown> {
  return authenticatedApiClient.post<unknown>(
    "/journeys",
    undefined,
    options,
  );
}