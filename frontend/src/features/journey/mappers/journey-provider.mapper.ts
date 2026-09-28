// -----------------------------------------------------------------------------
// sisiMove — Journey Provider Mapper
// -----------------------------------------------------------------------------
//
// Maps the provider projection returned by the backend public Journey query
// into the frontend JourneyProvider model.
//
// A Journey provider is a composed public projection:
//
//   Journey
//      └── provider
//          ├── traveller
//          └── trust
//
// Journey does not own Traveller or Trust data.
//
// The backend GetPublicJourneysQueryHandler already composes these public
// projections before returning the Journey response. Therefore this mapper:
//
// - does not fetch Traveller data;
// - does not fetch Trust data;
// - does not reconstruct either bounded context;
// - does not depend on Traveller/Trust mapper files;
// - only translates the already-composed HTTP projection.
//
// -----------------------------------------------------------------------------

import type { PublicTraveller } from "@/features/traveller-profile/models/public-traveller";
import type { PublicTravellerTrust } from "@/features/trust/models/public-traveller-trust";

import type { JourneyProvider } from "../models/journey-provider";

export interface JourneyProviderResponse {
  readonly traveller: PublicTraveller;
  readonly trust: PublicTravellerTrust;
}

export const JourneyProviderMapper = {
  fromResponse(response: JourneyProviderResponse): JourneyProvider {
    return {
      traveller: response.traveller,
      trust: response.trust,
    };
  },
};