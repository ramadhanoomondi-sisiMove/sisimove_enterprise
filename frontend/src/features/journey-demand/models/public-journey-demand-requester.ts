// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Requester
// -----------------------------------------------------------------------------
//
// Public read model for the traveller who created a Journey Demand.
//
// JourneyDemand stores requesterPublicId as an opaque cross-domain reference
// to Identity. The public marketplace must not expose that Identity reference.
//
// The public read boundary resolves the reference into:
//
//     PublicTraveller
//           +
//     PublicTravellerTrust
//
// This gives the marketplace:
//
//     WHO is looking to travel
//           +
//     WHY other travellers can trust them
//
// The requester model intentionally composes the existing public projections
// rather than creating another Traveller or Trust representation specific to
// Journey Demand.
// -----------------------------------------------------------------------------

import type { PublicTraveller } from '../../traveller-profile/models/public-traveller';
import type { PublicTravellerTrust } from '../../trust/models/public-traveller-trust';

export interface PublicJourneyDemandRequester {
  /**
   * Public traveller profile.
   *
   * Contains only traveller information intended for public discovery.
   */
  readonly traveller: PublicTraveller;

  /**
   * Public trust projection.
   *
   * Contains only trust information intended for public discovery.
   */
  readonly trust: PublicTravellerTrust;
}