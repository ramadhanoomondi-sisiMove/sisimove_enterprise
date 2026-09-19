// -----------------------------------------------------------------------------
// sisiMove — Get Traveller Profile By Member Public ID Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the existing Traveller Profile
// aggregate owned by a specific Identity public identifier.
//
// Relationship:
//
//     Identity.publicId
//            │
//            ▼
//     TravellerProfile.memberPublicId
//            │
//            ▼
//     TravellerProfileAggregate
//
// This query is particularly useful at authenticated application boundaries
// where the authenticated principal already provides the Identity public ID.
//
// The handler does NOT:
//
// - authenticate the request;
// - inspect JWTs;
// - access HTTP request objects;
// - perform authorization;
// - evaluate verification status;
// - determine marketplace capabilities;
// - create a Traveller Profile;
// - generate a Traveller handle;
// - access Prisma directly;
// - reconstruct the aggregate;
// - perform public visibility filtering.
//
// Authentication belongs to JwtAuthGuard.
// Authorization belongs to PermissionsGuard where required.
// Persistence belongs to TravellerProfileRepository.
//
// The Traveller Profile already exists because registration created it.
// Therefore this handler is strictly a read operation.
//
// -----------------------------------------------------------------------------
//
// Query:
//
//     GetTravellerProfileByMemberPublicIdQuery
//
// Input:
//
//     memberPublicId
//
// Output:
//
//     TravellerProfileAggregate | null
//
// -----------------------------------------------------------------------------
//
// Authenticated shell flow:
//
//     JWT
//      │
//      ▼
//     AuthenticatedIdentity
//      │
//      └── identityPublicId
//              │
//              ▼
//     GetTravellerProfileByMemberPublicIdQuery
//              │
//              ▼
//     GetTravellerProfileByMemberPublicIdQueryHandler
//              │
//              ▼
//     TravellerProfileRepository.findByMemberPublicId()
//              │
//              ▼
//     TravellerProfileAggregate
//              │
//              └── handle
//
// The handler does not derive the handle. It reads the handle that was already
// persisted on TravellerProfile during registration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Query
// -----------------------------------------------------------------------------

import type { GetTravellerProfileByMemberPublicIdQuery } from '../queries/get-traveller-profile-by-member-public-id.query';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';
import { MemberPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Retrieves an existing Traveller Profile aggregate by the public identifier
 * of the Identity that owns the profile.
 *
 * The repository is injected through the Traveller Profile application token.
 *
 * This handler intentionally returns the broad TravellerProfileAggregate
 * because it belongs to the existing Traveller Profile application read
 * boundary. Individual HTTP consumers remain responsible for mapping the
 * aggregate into the representation appropriate for their boundary.
 */
@Injectable()
export class GetTravellerProfileByMemberPublicIdQueryHandler implements QueryHandler<
  GetTravellerProfileByMemberPublicIdQuery,
  TravellerProfileAggregate | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly travellerProfileRepository: TravellerProfileRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Traveller Profile lookup.
   *
   * The query contains the public identifier of the owning Identity.
   *
   * The repository already exposes the corresponding domain lookup:
   *
   *     findByMemberPublicId(...)
   *
   * Therefore no additional repository method is required.
   */
  public async execute(
    query: GetTravellerProfileByMemberPublicIdQuery,
  ): Promise<TravellerProfileAggregate | null> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------
    //
    // Application query objects should normally always be present when
    // dispatched through the application bus/handler boundary.
    //
    // The guard nevertheless prevents an invalid direct invocation from
    // reaching the repository with an undefined query.
    //
    // -------------------------------------------------------------------------

    if (query === undefined) {
      return null;
    }

    // -------------------------------------------------------------------------
    // 2. Member Public ID guard
    // -------------------------------------------------------------------------
    //
    // The query contract carries a primitive string because application
    // queries are transport/application-facing messages.
    //
    // The repository boundary requires the domain MemberPublicId value object.
    //
    // Empty input therefore represents "no matching Traveller Profile".
    //
    // -------------------------------------------------------------------------

    if (
      query.memberPublicId === undefined ||
      query.memberPublicId.trim().length === 0
    ) {
      return null;
    }

    // -------------------------------------------------------------------------
    // 3. Construct the domain value object
    // -------------------------------------------------------------------------
    //
    // MemberPublicId remains the domain source of truth for validation and
    // normalization.
    //
    // The handler does not duplicate the value object's rules.
    //
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(query.memberPublicId);

    // -------------------------------------------------------------------------
    // 4. Resolve the existing Traveller Profile aggregate
    // -------------------------------------------------------------------------
    //
    // Aggregate reconstruction belongs to the repository/infrastructure
    // boundary.
    //
    // The handler does not access Prisma and does not manually reconstruct
    // TravellerProfileEntity, preferences, or corridors.
    //
    // -------------------------------------------------------------------------

    return this.travellerProfileRepository.findByMemberPublicId(memberPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetTravellerProfileByMemberPublicIdQueryHandler;
