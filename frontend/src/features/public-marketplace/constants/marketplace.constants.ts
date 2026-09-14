// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Constants
// -----------------------------------------------------------------------------
//
// Constants owned by the Public Marketplace feature.
//
// These values describe marketplace presentation/query conventions that are
// stable across the landing page, marketplace hooks, filters, sorting, and
// pagination.
//
// They are NOT business-domain constants.
//
// Journey-specific rules belong to the Journey feature.
// Journey Demand rules belong to the Journey Demand feature.
// Trust rules belong to the Trust feature.
//
// The marketplace constants only describe how those public resources are
// discovered and presented together.
//
// -----------------------------------------------------------------------------

import type {
  PublicMarketplaceItemType,
  PublicMarketplaceSortDirection,
  PublicMarketplaceSortField,
  PublicMarketplaceType,
} from "../models";

// -----------------------------------------------------------------------------
// Marketplace defaults
// -----------------------------------------------------------------------------

/**
 * Default marketplace stream.
 *
 * ALL is intentional.
 *
 * A visitor entering sisiMove should see the marketplace before being asked
 * to search or choose a specific stream.
 */
export const DEFAULT_MARKETPLACE_TYPE: PublicMarketplaceType = "ALL";

/**
 * Default number of marketplace items requested per page.
 *
 * This is a frontend read-side default and can be changed independently from
 * domain rules or database pagination.
 */
export const DEFAULT_MARKETPLACE_PAGE_SIZE = 12;

/**
 * Maximum number of items the public marketplace requests in one page.
 *
 * This protects the public discovery surface from accidentally requesting
 * an unnecessarily large result set.
 */
export const MAX_MARKETPLACE_PAGE_SIZE = 48;

// -----------------------------------------------------------------------------
// Marketplace item types
// -----------------------------------------------------------------------------

/**
 * Public marketplace item types.
 *
 * These values are useful when building tabs, filters, analytics labels, or
 * URL/query state.
 */
export const MARKETPLACE_ITEM_TYPES: readonly PublicMarketplaceItemType[] = [
  "JOURNEY",
  "DEMAND",
];

/**
 * Public marketplace stream options.
 *
 * ALL is a UI/read-model scope and therefore does not belong to the underlying
 * Journey or Journey Demand domains.
 */
export const MARKETPLACE_TYPES: readonly PublicMarketplaceType[] = [
  "ALL",
  "JOURNEY",
  "DEMAND",
];

// -----------------------------------------------------------------------------
// Marketplace sorting
// -----------------------------------------------------------------------------

/**
 * Supported public marketplace sort fields.
 */
export const MARKETPLACE_SORT_FIELDS: readonly PublicMarketplaceSortField[] = [
  "RELEVANCE",
  "DATE",
  "PRICE",
  "NEWEST",
];

/**
 * Supported marketplace sort directions.
 */
export const MARKETPLACE_SORT_DIRECTIONS: readonly PublicMarketplaceSortDirection[] =
  [
    "ASC",
    "DESC",
  ];

/**
 * Default marketplace sorting.
 *
 * Relevance is the safest default because the marketplace should first feel
 * like a useful collection of available travel opportunities rather than an
 * arbitrary chronological database listing.
 */
export const DEFAULT_MARKETPLACE_SORT: Readonly<{
  field: PublicMarketplaceSortField;
  direction: PublicMarketplaceSortDirection;
}> = {
  field: "RELEVANCE",
  direction: "DESC",
};

// -----------------------------------------------------------------------------
// Marketplace query parameter names
// -----------------------------------------------------------------------------
//
// These names are intentionally centralized because marketplace state may be
// represented in:
// - URL query parameters;
// - API requests;
// - browser navigation;
// - filter controls.
//
// The mapper remains responsible for translating these external values into
// PublicMarketplaceQuery.
//
// -----------------------------------------------------------------------------

export const MARKETPLACE_QUERY_PARAMS = {
  TYPE: "type",
  FROM: "from",
  TO: "to",
  DATE: "date",
  MINIMUM_SEATS: "minimumSeats",
  MAXIMUM_PRICE_PER_SEAT: "maximumPricePerSeat",
  HAS_VEHICLE: "hasVehicle",
  VERIFIED_TRAVELLER_ONLY: "verifiedTravellerOnly",
  SORT: "sort",
  DIRECTION: "direction",
  LIMIT: "limit",
  CURSOR: "cursor",
} as const;

// -----------------------------------------------------------------------------
// Marketplace UI labels
// -----------------------------------------------------------------------------
//
// These are intentionally limited to stable marketplace concepts.
//
// Domain-specific labels such as Journey preference names or Trust badge
// descriptions should remain owned by their respective features.
//
// -----------------------------------------------------------------------------

export const MARKETPLACE_LABELS = {
  ALL: "All",
  JOURNEYS: "Journeys",
  DEMANDS: "Demand",
  SHOWING: "Showing what's available",
  LOAD_MORE: "Load more",
  VIEW_JOURNEY: "View journey",
  VIEW_DEMAND: "View demand",
  BOOK: "Book",
  JOIN: "Join",
} as const;

// -----------------------------------------------------------------------------
// Marketplace routes
// -----------------------------------------------------------------------------

/**
 * Public marketplace routes.
 *
 * These are presentation routes only. Domain-specific public resources retain
 * their own routes.
 */
export const MARKETPLACE_ROUTES = {
  HOME: "/",
  JOURNEY: "/journeys",
  DEMAND: "/demands",
} as const;