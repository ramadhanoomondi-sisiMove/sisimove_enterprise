// -----------------------------------------------------------------------------
// Public Traveller Discovery
// -----------------------------------------------------------------------------
//
// Top-level public read model for SisiMove traveller discovery.
//
// This model composes:
//
// - public traveller identity
// - public trust summary
// - publicly discoverable traveller activities
//
// It is a frontend read-model contract and is intentionally independent of
// backend domain entities, Prisma models, persistence structures, and internal
// lifecycle state.
//
// The public discovery API is responsible for filtering and projecting only
// information eligible for anonymous public access.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { PublicTraveller } from './public-traveller';
import type { PublicTravellerActivity } from './public-traveller-activity';
import type { PublicTravellerTrust } from './public-traveller-trust';


// -----------------------------------------------------------------------------
// Discovery Activity Filter
// -----------------------------------------------------------------------------

/**
 * Public discovery activity filter.
 *
 * These values represent product-level discovery concepts and are not
 * required to match backend domain enum names.
 */
export type PublicTravellerDiscoveryActivityFilter =
  | 'ALL'
  | 'JOURNEYS'
  | 'DEMANDS';


// -----------------------------------------------------------------------------
// Discovery Query
// -----------------------------------------------------------------------------

/**
 * Search criteria for public traveller discovery.
 *
 * All fields are optional so the discovery experience can initially load
 * an unfiltered public feed and progressively apply route, date, or
 * activity filters.
 *
 * The public API is responsible for validating and interpreting these
 * values against its public discovery/read-model rules.
 */
export interface PublicTravellerDiscoveryQuery {
  /**
   * Public origin/location search term.
   *
   * Example:
   *
   * Nairobi
   */
  from?: string;

  /**
   * Public destination/location search term.
   *
   * Example:
   *
   * Kisumu
   */
  to?: string;

  /**
   * Requested travel date.
   *
   * Must use ISO-8601 calendar-date format:
   *
   * YYYY-MM-DD
   *
   * Example:
   *
   * 2026-09-12
   */
  date?: string;

  /**
   * Activity type to discover.
   *
   * Defaults to the complete public discovery feed when omitted.
   */
  type?: PublicTravellerDiscoveryActivityFilter;
}


// -----------------------------------------------------------------------------
// Discovery Pagination
// -----------------------------------------------------------------------------

/**
 * Cursor-based pagination metadata for public traveller discovery.
 *
 * Pagination is server-authoritative. The frontend must not derive
 * pagination state from the number of returned results.
 */
export interface PublicTravellerDiscoveryPagination {
  /**
   * Opaque cursor supplied by the public API for retrieving the next page.
   *
   * Null means that no next page is available.
   */
  nextCursor: string | null;

  /**
   * Whether another page is available.
   */
  hasNextPage: boolean;
}


// -----------------------------------------------------------------------------
// Discovery Result
// -----------------------------------------------------------------------------

/**
 * A single public traveller discovery result.
 *
 * The result deliberately composes traveller identity, trust, and activity
 * information into one public read-model entry.
 *
 * This allows the landing page to render a traveller card without making
 * separate Trust or Activity requests for every traveller.
 */
export interface PublicTravellerDiscoveryResult {
  /**
   * Public traveller social-identity summary.
   */
  traveller: PublicTraveller;

  /**
   * Public trust summary relevant to traveller discovery.
   *
   * Trust is embedded in the discovery projection to avoid an N+1 request
   * pattern where the frontend would otherwise request trust information
   * separately for every traveller.
   */
  trust: PublicTravellerTrust;

  /**
   * Public traveller activities matching the discovery criteria.
   *
   * Activities are limited to publicly discoverable journeys and journey
   * demands.
   */
  activities: PublicTravellerActivity[];
}


// -----------------------------------------------------------------------------
// Discovery Response
// -----------------------------------------------------------------------------

/**
 * Complete public traveller-discovery response.
 *
 * This is the primary response contract consumed by the public discovery
 * feature.
 */
export interface PublicTravellerDiscovery {
  /**
   * Public traveller discovery results.
   */
  results: PublicTravellerDiscoveryResult[];

  /**
   * Cursor-based pagination metadata.
   */
  pagination: PublicTravellerDiscoveryPagination;
}