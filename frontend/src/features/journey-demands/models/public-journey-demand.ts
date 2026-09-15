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
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandCapacity } from './public-journey-demand-capacity';
import type { PublicJourneyDemandParticipant } from './public-journey-demand-participant';
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
   * Traveller who created the Demand.
   *
   * The requester is composed from the public Traveller Profile and public
   * Trust read models.
   *
   * Internal requester/member identifiers are intentionally not exposed.
   */
  readonly requester: PublicJourneyDemandRequester;

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
   * Requested origin, destination, and intermediate locations.
   */
  readonly route: PublicJourneyDemandRoute;

  /**
   * Flexible requested departure and arrival window.
   */
  readonly schedule: PublicJourneyDemandSchedule;

  /**
   * Number of seats requested, matched, and remaining.
   */
  readonly capacity: PublicJourneyDemandCapacity;

  /**
   * Price requirements supplied by the requester.
   */
  readonly pricing: PublicJourneyDemandPricing;

  /**
   * Other travellers who have joined the Demand.
   *
   * Participants provide visible evidence that the Demand represents an
   * actual shared travel need.
   *
   * Participant member identifiers are not exposed by this public contract.
   */
  readonly participants: readonly PublicJourneyDemandParticipant[];
}