// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace
// -----------------------------------------------------------------------------
//
// Public read model for the sisiMove marketplace.
//
// The Public Marketplace is a frontend/read-composition boundary.
//
// It is NOT a new business domain and it does not own:
// - Journeys;
// - Journey Demands;
// - Traveller Profiles;
// - Trust;
// - Assets.
//
// Those domains remain authoritative for their own data.
//
// The marketplace exists to answer one public-facing question:
//
//     "What is available in the sisiMove market right now?"
//
// It combines public Journey supply and public Journey Demand into a single
// discovery surface that can be rendered by the landing page.
//
// -----------------------------------------------------------------------------
//
// Marketplace composition
//
//     Public Marketplace
//          │
//          ├── Journey supply
//          │      └── PublicJourney
//          │
//          └── Journey demand
//                 └── PublicJourneyDemand
//
// The marketplace therefore knows about public representations of these
// feature domains, but it does not own their lifecycle or business rules.
//
// -----------------------------------------------------------------------------
//
// Physical-market analogy
//
// A person entering a physical market should see what is currently available
// before being asked what they are looking for.
//
// sisiMove follows the same principle:
//
//     Landing page
//          ↓
//     published marketplace items are visible
//          ↓
//     visitor browses
//          ↓
//     visitor may refine with search/filter
//          ↓
//     visitor views a Journey or Demand
//          ↓
//     visitor acts
//
// Search is therefore a refinement mechanism, not the prerequisite for
// discovering the marketplace.
//
// -----------------------------------------------------------------------------

import type { PublicMarketplaceItem } from "./public-marketplace-item";
import type { PublicMarketplacePagination } from "./public-marketplace-pagination";
import type { PublicMarketplaceQuery } from "./public-marketplace-query";

// -----------------------------------------------------------------------------
// Public Marketplace
// -----------------------------------------------------------------------------

export interface PublicMarketplace {
  /**
   * Items currently available through the public marketplace.
   *
   * The collection may contain both:
   *
   * - JOURNEY — published travel supply;
   * - DEMAND  — published travel demand.
   *
   * Ordering is determined by the marketplace read boundary and may be
   * affected by the supplied query/sort criteria.
   */
  items: PublicMarketplaceItem[];

  /**
   * Query state used to produce this marketplace view.
   *
   * Keeping the resolved query with the result makes the read model explicit
   * and allows the UI to understand which marketplace view it is rendering.
   */
  query: PublicMarketplaceQuery;

  /**
   * Pagination state for the current marketplace result.
   */
  pagination: PublicMarketplacePagination;
}