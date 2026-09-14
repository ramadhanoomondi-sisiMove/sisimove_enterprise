// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Item
// -----------------------------------------------------------------------------
//
// A PublicMarketplaceItem represents ONE discoverable object in the public
// sisiMove marketplace.
//
// The marketplace contains two primary kinds of discoverable objects:
//
//     JOURNEY
//         Published travel supply.
//         Someone is travelling and has available seats.
//
//     DEMAND
//         Published travel demand.
//         Someone is planning to travel and is looking for supply.
//
// These are intentionally represented as a discriminated union.
//
// The marketplace does NOT flatten Journey and Journey Demand into one giant
// interface. Doing so would create a weak model full of nullable fields such
// as:
//
//     journey?: ...
//     demand?: ...
//     vehicle?: ...
//     maximumPrice?: ...
//
// Instead, the discriminator tells the frontend exactly which domain object
// exists for each marketplace item.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       type: "JOURNEY",
//       journey: {
//         publicId: "...",
//         ...
//       }
//     }
//
//     {
//       type: "DEMAND",
//       demand: {
//         publicId: "...",
//         ...
//       }
//     }
//
// This gives TypeScript and the UI a reliable narrowing mechanism:
//
//     if (item.type === "JOURNEY") {
//       // item.journey is available
//     }
//
//     if (item.type === "DEMAND") {
//       // item.demand is available
//     }
//
// -----------------------------------------------------------------------------
//
// Domain ownership
//
//     PublicMarketplaceItem
//            │
//            ├── JOURNEY ──→ PublicJourney
//            │
//            └── DEMAND  ──→ PublicJourneyDemand
//
// The marketplace owns neither object. It only composes their public
// representations for discovery.
//
// -----------------------------------------------------------------------------

import type { PublicJourney } from "../../journeys/models/public-journey";
import type { PublicJourneyDemand } from "../../journey-demands/models/public-journey-demand";

// -----------------------------------------------------------------------------
// Marketplace item type
// -----------------------------------------------------------------------------
//
// This is intentionally a small marketplace-level vocabulary.
//
// It describes WHAT kind of object is being displayed, not the lifecycle
// status of the underlying domain object.
//
// For example:
//
//     JOURNEY
//
// means "this marketplace item represents a Journey".
//
// It does not mean the Journey domain status is necessarily exposed here.
//
// -----------------------------------------------------------------------------

export type PublicMarketplaceItemType =
  | "JOURNEY"
  | "DEMAND";

// -----------------------------------------------------------------------------
// Public Marketplace Item
// -----------------------------------------------------------------------------
//
// Discriminated union.
//
// The `type` property is the discriminator.
//
// -----------------------------------------------------------------------------

export type PublicMarketplaceItem =
  | PublicMarketplaceJourneyItem
  | PublicMarketplaceDemandItem;

// -----------------------------------------------------------------------------
// Journey marketplace item
// -----------------------------------------------------------------------------

export interface PublicMarketplaceJourneyItem {
  /**
   * Identifies this marketplace item as published Journey supply.
   */
  type: "JOURNEY";

  /**
   * Public Journey read model.
   *
   * Journey remains the authoritative feature domain for:
   * - route;
   * - schedule;
   * - vehicle;
   * - capacity;
   * - pricing;
   * - preferences;
   * - provider;
   * - public assets.
   */
  journey: PublicJourney;
}

// -----------------------------------------------------------------------------
// Journey Demand marketplace item
// -----------------------------------------------------------------------------

export interface PublicMarketplaceDemandItem {
  /**
   * Identifies this marketplace item as published Journey Demand.
   */
  type: "DEMAND";

  /**
   * Public Journey Demand read model.
   *
   * Journey Demand remains the authoritative feature domain for:
   * - requested route;
   * - requested schedule;
   * - requested seats;
   * - price expectations;
   * - participants;
   * - requester.
   */
  demand: PublicJourneyDemand;
}