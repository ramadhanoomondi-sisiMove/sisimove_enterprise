// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand
// -----------------------------------------------------------------------------
//
// Primary public read model for the Journey Demand marketplace.
//
// Journey Demand is the public representation of TRAVEL NEED.
//
// A published Demand tells the marketplace:
//
//     "People are looking to travel this route under these conditions."
//
// It is therefore a first-class marketplace object alongside Journey supply.
//
// -----------------------------------------------------------------------------
//
// Public marketplace composition:
//
// PublicJourneyDemand
// ├── requester
// │   ├── traveller
// │   └── trust
// ├── route
// ├── schedule
// ├── capacity
// ├── pricing
// └── participants
//
// -----------------------------------------------------------------------------
//
// Marketplace flow:
//
//     Visitor discovers Demand
//              ↓
//     Understands route/time/price
//              ↓
//     Sees requester and trust
//              ↓
//     May join the Demand
//              ↓
//     Demand becomes stronger visible demand
//              ↓
//     Potential provider discovers opportunity
//              ↓
//     Provider may choose to publish a Journey
//
// IMPORTANT:
//
// A Demand does NOT automatically become a Journey.
//
// The Demand is a marketplace opportunity. A provider independently decides
// whether to create and publish supply that can satisfy it.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandCapacity } from "./public-journey-demand-capacity";
import type { PublicJourneyDemandParticipant } from "./public-journey-demand-participant";
import type { PublicJourneyDemandPricing } from "./public-journey-demand-pricing";
import type { PublicJourneyDemandRequester } from "./public-journey-demand-requester";
import type { PublicJourneyDemandRoute } from "./public-journey-demand-route";
import type { PublicJourneyDemandSchedule } from "./public-journey-demand-schedule";

// -----------------------------------------------------------------------------
// Public lifecycle
// -----------------------------------------------------------------------------

export type PublicJourneyDemandStatus =
  | "OPEN"
  | "MATCHED"
  | "CONVERTED"
  | "FULFILLED";

// -----------------------------------------------------------------------------
// Public Journey Demand
// -----------------------------------------------------------------------------

export interface PublicJourneyDemand {
  /**
   * Stable public identifier used by public Demand URLs.
   *
   * Example:
   *
   * /demands/{publicId}
   */
  publicId: string;

  /**
   * Traveller who created the Demand.
   */
  requester: PublicJourneyDemandRequester;

  /**
   * Public Demand lifecycle state.
   *
   * DRAFT, CANCELLED, and EXPIRED demands are not ordinary public marketplace
   * listings and should normally be filtered by the backend public read
   * boundary.
   */
  status: PublicJourneyDemandStatus;

  /**
   * Requested origin, destination, and intermediate locations.
   */
  route: PublicJourneyDemandRoute;

  /**
   * Flexible requested departure and arrival window.
   */
  schedule: PublicJourneyDemandSchedule;

  /**
   * Number of seats requested and remaining.
   */
  capacity: PublicJourneyDemandCapacity;

  /**
   * Price requirements supplied by the requester.
   */
  pricing: PublicJourneyDemandPricing;

  /**
   * Other travellers who have joined the Demand.
   *
   * Participants provide visible evidence that the Demand represents an
   * actual shared travel need.
   */
  participants: PublicJourneyDemandParticipant[];
}