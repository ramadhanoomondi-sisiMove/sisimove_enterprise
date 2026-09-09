// -----------------------------------------------------------------------------
// Traveller Discovery Constants
// -----------------------------------------------------------------------------
//
// Stable constants used by the public traveller-discovery feature.
//
// These constants describe frontend behavior and presentation defaults.
// They must not become a second source of truth for backend business rules.
//
// Backend validation, filtering, pagination limits, visibility rules, and
// eligibility rules remain authoritative on the server.
//
// -----------------------------------------------------------------------------

import type {
  PublicTravellerDiscoveryActivityFilter,
} from '../models';

// -----------------------------------------------------------------------------
// Activity Filters
// -----------------------------------------------------------------------------

/**
 * Available public discovery activity filters.
 *
 * The order is intentional and matches the primary discovery experience:
 *
 * ALL
 * JOURNEYS
 * DEMANDS
 */
export const PUBLIC_TRAVELLER_DISCOVERY_ACTIVITY_FILTERS =
  [
    'ALL',
    'JOURNEYS',
    'DEMANDS',
  ] as const satisfies readonly PublicTravellerDiscoveryActivityFilter[];

/**
 * Default activity filter for public discovery.
 */
export const DEFAULT_PUBLIC_TRAVELLER_DISCOVERY_ACTIVITY_FILTER:
  PublicTravellerDiscoveryActivityFilter =
  'ALL';

// -----------------------------------------------------------------------------
// Search
// -----------------------------------------------------------------------------

/**
 * Maximum number of characters accepted by the public discovery search
 * controls on the frontend.
 *
 * This is a UI constraint only.
 *
 * The backend must perform its own validation.
 */
export const PUBLIC_TRAVELLER_DISCOVERY_SEARCH_MAX_LENGTH =
  100;

/**
 * Maximum number of characters accepted for a public route/location search
 * value.
 *
 * This is a UI constraint for human-readable location input.
 */
export const PUBLIC_TRAVELLER_DISCOVERY_LOCATION_MAX_LENGTH =
  100;

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

/**
 * Default number of discovery results requested by the frontend.
 *
 * The backend remains authoritative over the actual page size and may return
 * fewer results or apply its own limits.
 */
export const DEFAULT_PUBLIC_TRAVELLER_DISCOVERY_PAGE_SIZE =
  20;

/**
 * Maximum page size the frontend will request.
 *
 * This protects the client from accidentally issuing unnecessarily large
 * discovery requests.
 *
 * The backend remains authoritative and may impose a lower maximum.
 */
export const MAX_PUBLIC_TRAVELLER_DISCOVERY_PAGE_SIZE =
  50;

// -----------------------------------------------------------------------------
// Dates
// -----------------------------------------------------------------------------

/**
 * Expected date input format for public traveller discovery.
 *
 * HTML date inputs and the public API use ISO calendar-date representation.
 */
export const PUBLIC_TRAVELLER_DISCOVERY_DATE_FORMAT =
  'YYYY-MM-DD';

// -----------------------------------------------------------------------------
// UI Labels
// -----------------------------------------------------------------------------

/**
 * Stable default labels for discovery activity filters.
 *
 * These are presentation defaults. They may later be replaced by the
 * application's localization system without changing the underlying
 * filter values.
 */
export const PUBLIC_TRAVELLER_DISCOVERY_ACTIVITY_FILTER_LABELS =
  {
    ALL: 'All',
    JOURNEYS: 'Travelling',
    DEMANDS: 'Looking',
  } as const satisfies Record<
    PublicTravellerDiscoveryActivityFilter,
    string
  >;

// -----------------------------------------------------------------------------
// Search Criteria
// -----------------------------------------------------------------------------

/**
 * Determines whether a discovery query contains at least one meaningful
 * search criterion.
 *
 * `ALL` is treated as the absence of an activity-specific filter.
 *
 * This is a frontend convenience helper only. It does not validate or
 * enforce backend discovery rules.
 */
export function hasPublicTravellerDiscoveryCriteria(
  query: {
    from?: string;
    to?: string;
    date?: string;
    type?: PublicTravellerDiscoveryActivityFilter;
  },
): boolean {
  return Boolean(
    query.from?.trim() ||
      query.to?.trim() ||
      query.date?.trim() ||
      (query.type && query.type !== 'ALL'),
  );
}