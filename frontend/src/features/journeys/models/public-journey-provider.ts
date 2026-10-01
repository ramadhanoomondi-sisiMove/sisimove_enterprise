// -----------------------------------------------------------------------------
// sisiMove — Public Journey Provider
// -----------------------------------------------------------------------------
//
// Public read model for the traveller providing a Journey.
//
// The Journey domain stores providerPublicId as an opaque reference to
// Identity.publicId. The public marketplace does not expose that identity
// reference directly.
//
// Instead, the public read boundary resolves the provider into:
// - PublicTraveller
// - PublicTravellerTrust
//
// This gives the marketplace:
// - WHO is providing the Journey
// - WHY other travellers can trust them
//
// -----------------------------------------------------------------------------

import type { PublicTraveller } from "../../traveller-profile/models/public-traveller";
import type { PublicTravellerTrust } from "../../trust/models/public-traveller-trust";

export interface PublicJourneyProvider {
  traveller: PublicTraveller;
  trust: PublicTravellerTrust;
}