// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Query
// -----------------------------------------------------------------------------
//
// Public query model for browsing the sisiMove marketplace.
//
// This model represents the visitor's requested marketplace view.
//
// It does NOT represent:
// - a Journey search request;
// - a Journey Demand creation request;
// - a backend persistence model;
// - business-domain state.
//
// It is simply the read/query contract used to determine which marketplace
// items should be returned and how they should be presented.
//
// -----------------------------------------------------------------------------
//
// Marketplace browsing principle
//
// The marketplace is visible BEFORE search.
//
// Therefore an empty query is valid:
//
//     {}
//
// or, conceptually:
//
//     {
//       type: "ALL"
//     }
//
// This means:
//
//     "Show me the marketplace."
//
// A visitor can then progressively refine the view:
//
//     From
//       ↓
//     To
//       ↓
//     Date
//       ↓
//     type
//       ↓
//     filters
//       ↓
//     sorting
//
// Search/filtering is therefore refinement of the marketplace rather than
// the mechanism that creates the marketplace.
//
// -----------------------------------------------------------------------------
//
// URL/query-string relationship
//
// The frontend may represent this state through URL parameters:
//
//     /?from=Nairobi&to=Kisumu&date=2026-09-18&type=JOURNEY
//
// The URL representation is external state.
//
// PublicMarketplaceQuery is the internal frontend representation.
//
// The mapping between URL/query parameters and this model belongs in the
// marketplace query mapper rather than inside UI components.
//
// -----------------------------------------------------------------------------

import type { PublicMarketplaceFilter } from "./public-marketplace-filter";
import type { PublicMarketplaceSort } from "./public-marketplace-sort";

// -----------------------------------------------------------------------------
// Marketplace item scope
// -----------------------------------------------------------------------------
//
// Determines which primary marketplace stream the visitor wants to see.
//
// ALL      → Journeys and Journey Demands
// JOURNEY  → published travel supply
// DEMAND   → published travel demand
//
// -----------------------------------------------------------------------------

export type PublicMarketplaceType =
  | "ALL"
  | "JOURNEY"
  | "DEMAND";

// -----------------------------------------------------------------------------
// Public Marketplace Query
// -----------------------------------------------------------------------------

export interface PublicMarketplaceQuery {
  /**
   * Marketplace stream being requested.
   *
   * Defaults conceptually to ALL when no specific type is supplied.
   *
   * Keeping the property explicit makes the current marketplace state
   * deterministic for tabs, URL synchronization, API requests, and result
   * rendering.
   */
  type: PublicMarketplaceType;

  /**
   * Optional origin search value.
   *
   * This is intentionally a user-facing search value rather than a domain
   * identifier.
   *
   * Example:
   *
   *     "Nairobi"
   */
  from: string | null;

  /**
   * Optional destination search value.
   *
   * Example:
   *
   *     "Kisumu"
   */
  to: string | null;

  /**
   * Optional journey date used to refine marketplace results.
   *
   * ISO date representation:
   *
   *     YYYY-MM-DD
   *
   * The marketplace query should not contain JavaScript Date objects because
   * this model can be serialized into URL state and API requests.
   */
  date: string | null;

  /**
   * Additional marketplace-level filtering criteria.
   *
   * Filters are kept separate from the base route/date query because they
   * represent secondary refinement rather than the primary marketplace
   * identity.
   */
  filter: PublicMarketplaceFilter | null;

  /**
   * Requested marketplace ordering.
   *
   * Sorting changes the presentation order of matching marketplace items; it
   * does not change the underlying Journey or Journey Demand.
   */
  sort: PublicMarketplaceSort | null;
}