// -----------------------------------------------------------------------------
// sisiMove — Get Public Traveller By Handle Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the reduced public Traveller Profile
// representation by its public handle.
//
// This query belongs to the public Traveller Profile read boundary.
//
// The query itself contains no business rules and performs no data access.
// Those responsibilities belong to the corresponding query handler.
//
// The handler is responsible for:
//
// - resolving the Traveller Profile by handle;
// - enforcing the public visibility boundary;
// - selecting the information permitted for anonymous consumers;
// - resolving the public avatar representation when required;
// - returning the reduced PublicTravellerProfileResponse.
//
// This query is intentionally separate from:
//
//     GetTravellerProfileByHandleQuery
//
// The existing query serves the broader Traveller Profile application
// representation. This query serves the anonymous public marketplace
// representation.
//
// HTTP boundary:
//
//     GET /traveller-profiles/public/handle/:handle
//
// Application flow:
//
//     HTTP Controller
//          ↓
//     GetPublicTravellerByHandleQuery
//          ↓
//     Query Handler
//          ↓
//     Public Traveller Profile Read Boundary
//          ↓
//     PublicTravellerProfileResponse
//
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetPublicTravellerByHandleQuery extends Query {
  constructor(public readonly handle: string) {
    super();
  }
}
