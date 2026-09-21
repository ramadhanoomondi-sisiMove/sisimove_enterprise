// -----------------------------------------------------------------------------
// sisiMove — Get Traveller Profile By Member Public ID Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the existing Traveller Profile
// aggregate owned by a specific Identity public identifier.
//
// Dependency injection:
//
// - TravellerProfileRepository is a domain abstraction.
// - The repository is injected through TRAVELLER_PROFILE_TOKENS.REPOSITORY.
//
// The handler does NOT:
//
// - authenticate requests;
// - inspect JWTs;
// - access HTTP request objects;
// - perform authorization;
// - access Prisma directly;
// - reconstruct aggregates;
// - perform public visibility filtering.
//
// Authentication belongs to JwtAuthGuard.
// Authorization belongs to the appropriate application/HTTP boundary.
// Persistence belongs to TravellerProfileRepository.
//
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

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import { MemberPublicId } from '../../domain/value-objects';

// =============================================================================
// Get Traveller Profile By Member Public ID Query Handler
// =============================================================================

/**
 * Retrieves an existing Traveller Profile aggregate by the public identifier
 * of the Identity that owns the profile.
 *
 * The repository is injected through the Traveller Profile application token.
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

  public async execute(
    query: GetTravellerProfileByMemberPublicIdQuery,
  ): Promise<TravellerProfileAggregate | null> {
    // -------------------------------------------------------------------------
    // Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      return null;
    }

    // -------------------------------------------------------------------------
    // Member Public ID guard
    // -------------------------------------------------------------------------

    if (
      query.memberPublicId === undefined ||
      query.memberPublicId.trim().length === 0
    ) {
      return null;
    }

    // -------------------------------------------------------------------------
    // Convert application primitive to domain value object
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(query.memberPublicId);

    // -------------------------------------------------------------------------
    // Resolve aggregate through repository abstraction
    // -------------------------------------------------------------------------

    return this.travellerProfileRepository.findByMemberPublicId(memberPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetTravellerProfileByMemberPublicIdQueryHandler;
