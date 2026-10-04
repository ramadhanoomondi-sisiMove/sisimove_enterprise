// -----------------------------------------------------------------------------
// sisiMove — Get Public Journeys API
// -----------------------------------------------------------------------------
//
// Public Journey marketplace query.
//
// Backend endpoint:
//
//   GET /api/v1/journeys/public
//
// Supported query parameters:
//
//   from?=...
//   to?=...
//   date?=...
//   minPrice?=...
//   maxPrice?=...
//
// The endpoint returns the public Journey projection, including:
//
//   - Journey route
//   - schedule
//   - vehicle
//   - capacity
//   - pricing
//   - preferences
//   - assets
//   - public provider traveller projection
//   - public provider trust projection
//
// This is a public endpoint and therefore uses the foundation `apiClient`
// rather than `authenticatedApiClient`.
//
// Architectural boundary:
//
//   UI / Hook
//       │
//       ▼
//   getPublicJourneys()
//       │
//       ▼
//   foundation apiClient
//       │
//       ▼
//   GET /journeys/public
//
// This adapter is responsible only for HTTP transport. It does not:
//
// - perform React Query operations;
// - map backend values into UI labels;
// - reconstruct Journey domain objects;
// - fetch provider/trust information separately;
// - calculate available seats;
// - apply marketplace filtering locally;
// - enforce Journey lifecycle rules.
//
// The backend public query is the source of truth for the public Journey
// projection and marketplace filtering.
//
// -----------------------------------------------------------------------------
//
// PRICE FILTER CONTRACT
// ---------------------
//
// Journey marketplace prices are expressed as per-seat prices in KES.
//
//   minPrice → minimum acceptable Journey price
//   maxPrice → maximum acceptable Journey price
//
// Empty price boundaries are omitted from the HTTP query.
//
// Examples:
//
//   minPrice=500
//   maxPrice=1500
//   minPrice=500&maxPrice=1500
//
// Invalid ranges (`minPrice > maxPrice`) are prevented by the marketplace
// filter component before this adapter is called.
//
// -----------------------------------------------------------------------------

import {
  apiClient,
  type RequestOptions,
} from "@/foundation/http";

import type { PublicJourney } from "../../models/public-journey";

// =============================================================================
// Query
// =============================================================================

export interface GetPublicJourneysQuery {
  /**
   * Optional origin search/filter value.
   *
   * Passed to the backend `from` query parameter.
   *
   * The backend performs case-insensitive partial matching.
   *
   * Examples:
   *
   *   "N"   → Nairobi
   *   "Na"  → Nairobi
   *   "Nai" → Nairobi
   */
  readonly from?: string;

  /**
   * Optional destination search/filter value.
   *
   * Passed to the backend `to` query parameter.
   *
   * The backend performs case-insensitive partial matching.
   *
   * Examples:
   *
   *   "M"    → Mombasa
   *   "Mom"  → Mombasa
   *   "Momb" → Mombasa
   */
  readonly to?: string;

  /**
   * Optional journey date filter.
   *
   * Passed to the backend `date` query parameter.
   */
  readonly date?: string;

  /**
   * Optional minimum acceptable Journey price in KES.
   *
   * Passed to the backend `minPrice` query parameter.
   *
   * `undefined` means no lower price boundary.
   */
  readonly minPrice?: number;

  /**
   * Optional maximum acceptable Journey price in KES.
   *
   * Passed to the backend `maxPrice` query parameter.
   *
   * `undefined` means no upper price boundary.
   */
  readonly maxPrice?: number;
}

// =============================================================================
// Query Parameters
// =============================================================================
//
// The foundation HTTP client expects query parameters to be represented as:
//
//   Record<string, string | number | boolean | null | undefined>
//
// Keep this as a Record rather than a narrower object interface so the
// generated query object is structurally compatible with `apiClient.get()`.
//
// =============================================================================

type PublicJourneysQueryParameters = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Builds the committed marketplace query parameters.
 *
 * Empty text/date values are omitted.
 *
 * Price boundaries are omitted when they are undefined.
 *
 * The adapter does not perform marketplace filtering itself. It only converts
 * the committed query contract into HTTP query parameters.
 */
function buildQuery(
  query: GetPublicJourneysQuery,
): PublicJourneysQueryParameters {
  const from = query.from?.trim();
  const to = query.to?.trim();
  const date = query.date?.trim();

  return {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    ...(date ? { date } : {}),
    ...(query.minPrice !== undefined
      ? { minPrice: query.minPrice }
      : {}),
    ...(query.maxPrice !== undefined
      ? { maxPrice: query.maxPrice }
      : {}),
  };
}

// =============================================================================
// API
// =============================================================================

/**
 * Fetch publicly discoverable Journeys.
 *
 * Backend:
 *
 *   GET /journeys/public
 *
 * No authentication is required.
 *
 * Search behavior is owned by the backend repository:
 *
 *   from     → corridor.originName contains, case-insensitive
 *   to       → corridor.destinationName contains, case-insensitive
 *   date     → departure calendar date
 *   minPrice → Journey per-seat price >= minPrice
 *   maxPrice → Journey per-seat price <= maxPrice
 *
 * The adapter only transports the committed marketplace filters.
 */
export async function getPublicJourneys(
  query: GetPublicJourneysQuery = {},
  options: RequestOptions = {},
): Promise<PublicJourney[]> {
  return apiClient.get<PublicJourney[]>(
    "/journeys/public",
    {
      ...options,
      query: buildQuery(query),
    },
  );
}