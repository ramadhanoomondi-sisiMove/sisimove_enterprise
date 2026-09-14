// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Requester
// -----------------------------------------------------------------------------
//
// Public read model for the traveller who created a Journey Demand.
//
// JourneyDemand stores requesterPublicId as an opaque reference to Identity.
// The public marketplace should not expose that Identity reference.
//
// The public read boundary resolves it into:
// - the public Traveller Profile
// - the public Trust Profile
//
// This gives the marketplace:
//     WHO is looking to travel
//     +
//     WHY other travellers can trust them
//
// -----------------------------------------------------------------------------

import type { PublicTraveller } from "../../traveller-profile/models/public-traveller";
import type { PublicTravellerTrust } from "../../trust/models/public-traveller-trust";

export interface PublicJourneyDemandRequester {
  traveller: PublicTraveller;
  trust: PublicTravellerTrust;
}