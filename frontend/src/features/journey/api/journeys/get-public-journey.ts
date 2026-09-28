// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey API
// -----------------------------------------------------------------------------
//
// Public Journey detail query.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/:journeyPublicId
//
// The backend currently resolves the single public Journey through the same
// public Journey query boundary used by GetPublicJourneysQueryHandler.
//
// This adapter therefore consumes a single `PublicJourney` projection and
// does not fetch Journey components independently.
//
// Architectural boundary:
//
//   Public Journey Detail
//       │
//       ▼
//   getPublicJourney()
//       │
//       ▼
//   foundation apiClient
//       │
//       ▼
//   GET /journeys/:journeyPublicId
//
// This adapter is responsible only for HTTP transport.
//
// It does not:
// - perform React Query operations;
// - reconstruct the Journey aggregate;
// - fetch Traveller Profile separately;
// - fetch Trust separately;
// - calculate capacity;
// - apply lifecycle rules;
// - map values into UI labels.
//
// -----------------------------------------------------------------------------

import {
  apiClient,
  type RequestOptions,
} from "@/foundation/http";

import type { PublicJourney } from "../../models/public-journey";

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Fetch one publicly discoverable Journey.
 *
 * Backend:
 *
 *   GET /journeys/:journeyPublicId
 *
 * No authentication is required.
 */
export async function getPublicJourney(
  journeyPublicId: string,
  options: RequestOptions = {},
): Promise<PublicJourney> {
  return apiClient.get<PublicJourney>(
    `/journeys/${encodeURIComponent(journeyPublicId)}`,
    options,
  );
}