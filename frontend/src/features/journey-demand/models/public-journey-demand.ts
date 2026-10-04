// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/models/public-journey-demand.ts
// -----------------------------------------------------------------------------
//
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
// └── demand
//     ├── participantCount
//     └── joinedSeats
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
//
// -----------------------------------------------------------------------------
//
// Public price semantics:
//
// `pricing.maximumPricePerSeat` represents the highest per-seat amount the
// requester is willing to accept for the Demand.
//
// Marketplace price filters operate against this value:
//
//     minPrice <= maximumPricePerSeat <= maxPrice
//
// Both boundaries are inclusive.
//
// The public Journey Demand projection exposes the pricing object itself.
// The marketplace API/query layer is responsible for applying price filters;
// this read model does not perform filtering.
//
// -----------------------------------------------------------------------------
//
// Public projections deliberately do not mirror the Prisma aggregate.
//
// Internal identifiers, lifecycle timestamps, version numbers, and other
// persistence concerns remain outside this public marketplace contract.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandCapacity } from './public-journey-demand-capacity';
import type { PublicJourneyDemandDemand } from './public-journey-demand-demand';
import type { PublicJourneyDemandPricing } from './public-journey-demand-pricing';
import type { PublicJourneyDemandRequester } from './public-journey-demand-requester';
import type { PublicJourneyDemandRoute } from './public-journey-demand-route';
import type { PublicJourneyDemandSchedule } from './public-journey-demand-schedule';

// -----------------------------------------------------------------------------
// Public Lifecycle
// -----------------------------------------------------------------------------

/**
 * Lifecycle states that may be represented by the public Journey Demand
 * contract.
 *
 * The backend public-read boundary remains responsible for deciding which
 * states are currently discoverable in the anonymous marketplace.
 */
export type PublicJourneyDemandStatus =
  | 'OPEN'
  | 'MATCHED'
  | 'CONVERTED'
  | 'FULFILLED';

// -----------------------------------------------------------------------------
// Public Journey Demand
// -----------------------------------------------------------------------------

export interface PublicJourneyDemand {
  /**
   * Stable public identifier used by public Demand URLs.
   *
   * Example:
   *
   *     /demands/{publicId}
   *
   * This is the only Journey Demand identifier exposed by the public
   * marketplace contract.
   */
  readonly publicId: string;

  /**
   * Public Demand lifecycle state.
   *
   * The backend public-read boundary determines which lifecycle states are
   * actually discoverable.
   *
   * DRAFT, CANCELLED, and EXPIRED demands are not ordinary public marketplace
   * listings.
   */
  readonly status: PublicJourneyDemandStatus;

  /**
   * Traveller who created the Demand.
   *
   * The requester is composed from the public Traveller Profile and public
   * Trust read models.
   *
   * Internal requester/member identifiers are intentionally not exposed.
   */
  readonly requester: PublicJourneyDemandRequester;

  /**
   * Requested origin, destination, and intermediate locations.
   */
  readonly route: PublicJourneyDemandRoute;

  /**
   * Flexible requested departure and arrival window.
   */
  readonly schedule: PublicJourneyDemandSchedule;

  /**
   * Passenger seat requirements supplied by the requester.
   */
  readonly capacity: PublicJourneyDemandCapacity;

  /**
   * Price requirements supplied by the requester.
   *
   * `maximumPricePerSeat` is the requester's upper acceptable per-seat price
   * and is the authoritative value used by the public marketplace price
   * filter.
   */
  readonly pricing: PublicJourneyDemandPricing;

  /**
   * Aggregated public evidence of participation in the Demand.
   *
   * Individual participant identities belong to the separate public Demand
   * detail/participant projection and are not required by the marketplace
   * listing.
   */
  readonly demand: PublicJourneyDemandDemand;
}