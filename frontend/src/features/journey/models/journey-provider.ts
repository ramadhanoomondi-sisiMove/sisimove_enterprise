// -----------------------------------------------------------------------------
// sisiMove — Journey Provider Model
// -----------------------------------------------------------------------------
//
// Public provider projection embedded in the public Journey response.
//
// The Journey bounded context does not own Traveller Profile or Trust data.
// The public Journey query composes reduced public projections from those
// bounded contexts.
//
// The provider contains:
// - the public traveller projection, including the public handle;
// - the public trust projection.
//
// This is a read/composition model, not a domain entity or persistence model.
//
// Cross-domain references remain behind their owning feature boundaries.
// -----------------------------------------------------------------------------

import type { PublicTraveller } from "@/features/traveller-profile/models/public-traveller";
import type { PublicTravellerTrust } from "@/features/trust/models/public-traveller-trust";

// -----------------------------------------------------------------------------
// Public Journey Provider
// -----------------------------------------------------------------------------

export interface JourneyProvider {
  /**
   * Public Traveller Profile projection.
   *
   * Includes the traveller's public handle, which can be used to navigate to:
   *
   *     /travellers/[handle]
   */
  readonly traveller: PublicTraveller;

  /**
   * Public Trust projection.
   *
   * Contains only trust information approved for public marketplace
   * consumption.
   */
  readonly trust: PublicTravellerTrust;
}