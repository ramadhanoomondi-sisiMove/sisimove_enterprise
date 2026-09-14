// -----------------------------------------------------------------------------
// Social — Get Public Traveller By Member Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the public Traveller Profile associated
// with a Member public identifier.
//
// This query exists specifically for public consumers such as the SisiMove
// marketplace.
//
// Unlike the broader Traveller Profile queries, this query represents the
// public Traveller read boundary. The query itself carries only the domain
// lookup criterion. Public response shaping belongs to the query handler.
//
// The query does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - resolve internal persistence identifiers;
// - expose private Traveller Profile data;
// - expose preferences or corridors;
// - expose lifecycle information;
// - expose internal journey statistics;
// - resolve asset metadata;
// - mutate the Traveller Profile aggregate;
// - persist the aggregate;
// - perform authentication or authorization.
//
// The query handler is responsible for resolving the TravellerProfileAggregate
// through TravellerProfileRepository.findByMemberPublicId() and shaping the
// result into the public Traveller representation.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//   GetPublicTravellerByMemberQuery
//                  │
//                  ▼
//   GetPublicTravellerByMemberQueryHandler
//                  │
//                  ▼
//   TravellerProfileRepository
//                  │
//                  ▼
//   TravellerProfileAggregate
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { MemberPublicId } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving the public Traveller Profile associated with a Member.
 *
 * The member public identifier is the externally meaningful identifier used
 * to resolve the Traveller Profile through the domain repository boundary.
 *
 * The query handler is responsible for:
 *
 * - resolving the TravellerProfileAggregate;
 * - enforcing the public visibility boundary;
 * - shaping the public Traveller representation;
 * - resolving any additional public read information required by that
 *   representation.
 *
 * Internal persistence identifiers and private Traveller Profile information
 * remain outside this query's contract.
 */
export class GetPublicTravellerByMemberQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Member whose public Traveller Profile should
     * be retrieved.
     *
     * The domain value object keeps the identifier domain-safe and aligned
     * with TravellerProfileRepository.findByMemberPublicId().
     */
    public readonly memberPublicId: MemberPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetPublicTravellerByMemberQuery;
