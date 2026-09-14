// -----------------------------------------------------------------------------
// sisiMove — Map Marketplace Query
// -----------------------------------------------------------------------------
//
// Maps external marketplace query state into the internal
// PublicMarketplaceQuery model.
//
// The marketplace can receive query state from several external sources:
//
// - URLSearchParams;
// - browser navigation;
// - form/filter controls;
// - API query parameters.
//
// Those representations are not trusted to already have the exact types and
// shapes required by the marketplace model.
//
// This mapper establishes the boundary:
//
//     External query state
//              ↓
//     mapMarketplaceQuery()
//              ↓
//     PublicMarketplaceQuery
//              ↓
//     marketplace hook / API
//
// -----------------------------------------------------------------------------
//
// Why this mapper exists
//
// This is a genuine marketplace mapping boundary because URL/API query
// parameters are string-based while the frontend marketplace model contains:
//
// - typed marketplace scope;
// - nullable route/date values;
// - numeric filter values;
// - boolean filter values;
// - structured sorting.
//
// The UI should not contain parsing logic such as:
//
//     Number(params.get("limit"))
//     params.get("type") === "JOURNEY"
//     params.get("hasVehicle") === "true"
//
// Keeping that logic here gives the marketplace one canonical interpretation
// of external query state.
//
// -----------------------------------------------------------------------------

import type {
  PublicMarketplaceFilter,
  PublicMarketplaceQuery,
  PublicMarketplaceSort,
  PublicMarketplaceType,
} from "../models";

import {
  DEFAULT_MARKETPLACE_SORT,
  DEFAULT_MARKETPLACE_TYPE,
} from "../constants";

// -----------------------------------------------------------------------------
// External marketplace query
// -----------------------------------------------------------------------------
//
// This represents query-string/API-style input.
//
// Everything is allowed to arrive as a string because URLSearchParams and
// HTTP query parameters are string-oriented.
//
// -----------------------------------------------------------------------------

export interface MarketplaceQueryInput {
  type?: string | null;

  from?: string | null;
  to?: string | null;
  date?: string | null;

  minimumSeats?: string | number | null;
  maximumPricePerSeat?: string | number | null;
  hasVehicle?: string | boolean | null;
  verifiedTravellerOnly?: string | boolean | null;

  sort?: string | null;
  direction?: string | null;
}

// -----------------------------------------------------------------------------
// Public mapper
// -----------------------------------------------------------------------------

/**
 * Maps external marketplace query state into the canonical
 * PublicMarketplaceQuery model.
 *
 * Invalid optional values are ignored and replaced with null/defaults rather
 * than being allowed to create malformed marketplace state.
 */
export function mapMarketplaceQuery(
  input: MarketplaceQueryInput = {},
): PublicMarketplaceQuery {
  return {
    type: mapMarketplaceType(input.type),

    from: mapOptionalString(input.from),
    to: mapOptionalString(input.to),
    date: mapOptionalDate(input.date),

    filter: mapMarketplaceFilter(input),

    sort: mapMarketplaceSort(input.sort, input.direction),
  };
}

// -----------------------------------------------------------------------------
// Marketplace type
// -----------------------------------------------------------------------------

function mapMarketplaceType(
  value: string | null | undefined,
): PublicMarketplaceType {
  const normalized = value?.trim().toUpperCase();

  switch (normalized) {
    case "JOURNEY":
      return "JOURNEY";

    case "DEMAND":
      return "DEMAND";

    case "ALL":
      return "ALL";

    default:
      return DEFAULT_MARKETPLACE_TYPE;
  }
}

// -----------------------------------------------------------------------------
// Marketplace filter
// -----------------------------------------------------------------------------

function mapMarketplaceFilter(
  input: MarketplaceQueryInput,
): PublicMarketplaceFilter | null {
  const minimumSeats = mapPositiveInteger(input.minimumSeats);
  const maximumPricePerSeat = mapNonNegativeInteger(
    input.maximumPricePerSeat,
  );

  const hasVehicle = mapOptionalBoolean(input.hasVehicle);
  const verifiedTravellerOnly = mapOptionalBoolean(
    input.verifiedTravellerOnly,
  );

  /**
   * No secondary filter has been supplied.
   *
   * Returning null keeps the marketplace model semantically clear:
   *
   *     null = no secondary marketplace filtering
   *
   * rather than creating an object containing only null properties.
   */
  if (
    minimumSeats === null &&
    maximumPricePerSeat === null &&
    hasVehicle === null &&
    verifiedTravellerOnly === null
  ) {
    return null;
  }

  return {
    minimumSeats,
    maximumPricePerSeat,
    hasVehicle,
    verifiedTravellerOnly,
  };
}

// -----------------------------------------------------------------------------
// Marketplace sorting
// -----------------------------------------------------------------------------

function mapMarketplaceSort(
  value: string | null | undefined,
  direction: string | null | undefined,
): PublicMarketplaceSort {
  const field = mapMarketplaceSortField(value);

  return {
    field,
    direction: mapMarketplaceSortDirection(
      direction,
      field === DEFAULT_MARKETPLACE_SORT.field
        ? DEFAULT_MARKETPLACE_SORT.direction
        : "ASC",
    ),
  };
}

function mapMarketplaceSortField(
  value: string | null | undefined,
): PublicMarketplaceSort["field"] {
  switch (value?.trim().toUpperCase()) {
    case "DATE":
      return "DATE";

    case "PRICE":
      return "PRICE";

    case "NEWEST":
      return "NEWEST";

    case "RELEVANCE":
      return "RELEVANCE";

    default:
      return DEFAULT_MARKETPLACE_SORT.field;
  }
}

function mapMarketplaceSortDirection(
  value: string | null | undefined,
  fallback: PublicMarketplaceSort["direction"],
): PublicMarketplaceSort["direction"] {
  switch (value?.trim().toUpperCase()) {
    case "ASC":
      return "ASC";

    case "DESC":
      return "DESC";

    default:
      return fallback;
  }
}

// -----------------------------------------------------------------------------
// Primitive normalization
// -----------------------------------------------------------------------------

function mapOptionalString(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

// -----------------------------------------------------------------------------
// Date normalization
// -----------------------------------------------------------------------------

function mapOptionalDate(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  /**
   * Marketplace date state uses YYYY-MM-DD.
   *
   * We deliberately do not construct a JavaScript Date here. A marketplace
   * search date is a calendar date, not a timestamp, and converting it to a
   * Date can introduce timezone-related changes.
   */
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

// -----------------------------------------------------------------------------
// Number normalization
// -----------------------------------------------------------------------------

function mapPositiveInteger(
  value: string | number | null | undefined,
): number | null {
  const parsed = mapInteger(value);

  return parsed !== null && parsed > 0 ? parsed : null;
}

function mapNonNegativeInteger(
  value: string | number | null | undefined,
): number | null {
  const parsed = mapInteger(value);

  return parsed !== null && parsed >= 0 ? parsed : null;
}

function mapInteger(
  value: string | number | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed =
    typeof value === "number"
      ? value
      : Number(value.trim());

  if (!Number.isInteger(parsed) || !Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

// -----------------------------------------------------------------------------
// Boolean normalization
// -----------------------------------------------------------------------------

function mapOptionalBoolean(
  value: string | boolean | null | undefined,
): boolean | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  switch (value.trim().toLowerCase()) {
    case "true":
    case "1":
      return true;

    case "false":
    case "0":
      return false;

    default:
      return null;
  }
}