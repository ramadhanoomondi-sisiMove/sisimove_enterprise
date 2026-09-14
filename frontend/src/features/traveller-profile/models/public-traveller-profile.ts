// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Profile
// -----------------------------------------------------------------------------
//
// Public composition model for a Traveller Profile page.
//
// `PublicTraveller` represents the Traveller Profile itself.
//
// `PublicTravellerProfile` represents the richer public page composition,
// where the profile is presented together with public trust information and
// public journey activity.
//
// This distinction is intentional:
//
//   PublicTraveller
//       ↓
//   Traveller Profile domain representation
//
//   PublicTravellerProfile
//       ↓
//   Public page / read composition
//
// The composition model may contain information owned by several feature
// domains. It therefore does not mirror a single backend aggregate.
//
// Cross-domain references remain opaque public identifiers. The frontend does
// not use internal database identifiers or reconstruct relationships between
// domains.
//
// The composition boundary is responsible for deciding which public
// information is available on the Traveller Profile page.
//
// It must not expose:
//
// - internal Identity identifiers;
// - memberPublicId as an implementation detail;
// - private Trust information;
// - private Journey information;
// - private Journey Demand information;
// - operational booking information;
// - private contact information;
// - internal persistence state.
//
// -----------------------------------------------------------------------------

import type { PublicTraveller } from './public-traveller';

import type { PublicTravellerTrust } from '@/features/trust/models/public-traveller-trust';

import type { PublicJourney } from '@/features/journeys/models/public-journey';

import type { PublicJourneyDemand } from '@/features/journey-demands/models/public-journey-demand';

// -----------------------------------------------------------------------------
// Public Traveller Profile
// -----------------------------------------------------------------------------

export interface PublicTravellerProfile {
  /**
   * Public Traveller Profile representation.
   */
  traveller: PublicTraveller;

  /**
   * Public trust information for the traveller.
   *
   * Trust is optional because a public profile may legitimately exist without
   * a public trust profile being available.
   */
  trust: PublicTravellerTrust | null;

  /**
   * Published Journeys publicly associated with this traveller.
   *
   * Only journeys already authorized for public discovery belong here.
   */
  journeys: readonly PublicJourney[];

  /**
   * Public Journey Demands associated with this traveller.
   *
   * Only demands already authorized for public discovery belong here.
   */
  demands: readonly PublicJourneyDemand[];
}

