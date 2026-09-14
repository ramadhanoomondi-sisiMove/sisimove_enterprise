// -----------------------------------------------------------------------------
// Social — Get Public Traveller By Member Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the public Traveller Profile
// representation by Member public identifier.
//
// Aggregate:
//
// TravellerProfileAggregate
// ├── TravellerProfileEntity
// ├── TravellerProfilePreferencesEntity?
// └── TravellerProfileCorridorEntity[]
//
// Responsibilities:
//
// - validate the query;
// - validate the Member public identifier;
// - retrieve the Traveller Profile aggregate through TravellerProfileRepository;
// - ensure the aggregate exists;
// - ensure the Traveller Profile is publicly visible;
// - return the deliberately reduced public Traveller Profile representation.
//
// The handler does NOT:
//
// - mutate TravellerProfileEntity;
// - mutate TravellerProfilePreferencesEntity;
// - mutate TravellerProfileCorridorEntity;
// - persist the aggregate;
// - access Prisma directly;
// - reconstruct the aggregate;
// - expose private preferences;
// - expose private corridors;
// - expose journey statistics;
// - expose internal database identifiers;
// - expose the broad TravellerProfileResponse;
// - create domain events;
// - perform authentication;
// - manage sessions;
// - perform external side effects.
//
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// Public read shaping belongs to this application handler.
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
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetPublicTravellerByMemberQuery } from '../queries/get-public-traveller-by-member.query';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { TravellerProfilePublicNotFoundException } from '../../domain/exceptions/traveller-profile-public-not-found.exception';

// =============================================================================
// Public Response
// =============================================================================
//
// This is intentionally a reduced application read representation.
//
// It is NOT the broad TravellerProfileResponse used by the existing internal
// and administrative Traveller Profile endpoints.
//
// Only information that is safe and useful for public Traveller discovery
// crosses this query boundary.
// =============================================================================

export interface PublicTravellerProfileResponse {
  publicId: string;

  handle: string;

  bio: string | null;

  avatar: {
    publicId: string;
  } | null;

  countryCode: string;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a publicly visible Traveller Profile by Member public
 * identifier.
 *
 * The repository resolves the complete TravellerProfileAggregate.
 *
 * The handler then:
 *
 * 1. verifies that the aggregate exists;
 * 2. verifies that the aggregate is publicly visible;
 * 3. deliberately reduces the aggregate into the public Traveller contract.
 *
 * A missing, private, or limited-visibility Traveller Profile is represented
 * by the same public exception so that this endpoint does not disclose whether
 * a non-public Traveller Profile exists.
 */
@Injectable()
export class GetPublicTravellerByMemberQueryHandler implements QueryHandler<
  GetPublicTravellerByMemberQuery,
  PublicTravellerProfileResponse
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
   * Executes the public Traveller Profile query.
   *
   * A Traveller Profile that does not exist or is not publicly visible is
   * treated as unavailable through this public read boundary.
   */
  public async execute(
    query: GetPublicTravellerByMemberQuery,
  ): Promise<PublicTravellerProfileResponse> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------
    //
    // The handler explicitly guards the application input before accessing
    // the repository.
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 2. Member public ID guard
    // -------------------------------------------------------------------------
    //
    // GetPublicTravellerByMemberQuery carries the domain-ready MemberPublicId
    // value object.
    //
    // The handler therefore does not reconstruct, parse, or normalize the
    // identifier here.
    // -------------------------------------------------------------------------

    if (query.memberPublicId === undefined) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 3. Resolve the Traveller Profile aggregate
    // -------------------------------------------------------------------------
    //
    // The repository owns aggregate reconstruction.
    //
    // Expected aggregate boundary:
    //
    // TravellerProfileAggregate
    // ├── TravellerProfileEntity
    // ├── TravellerProfilePreferencesEntity?
    // └── TravellerProfileCorridorEntity[]
    //
    // The handler does not access persistence or reconstruct any entity.
    // -------------------------------------------------------------------------

    const aggregate =
      await this.travellerProfileRepository.findByMemberPublicId(
        query.memberPublicId,
      );

    // -------------------------------------------------------------------------
    // 4. Ensure the aggregate exists
    // -------------------------------------------------------------------------
    //
    // A public lookup uses the public-not-found exception so that the endpoint
    // does not expose internal distinctions between missing and non-public
    // Traveller Profiles.
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 5. Enforce the public visibility boundary
    // -------------------------------------------------------------------------
    //
    // Public consumers must only receive profiles explicitly marked as public.
    //
    // The aggregate owns the visibility rule. The handler therefore delegates
    // the decision to TravellerProfileAggregate.isPublic() rather than
    // inspecting persistence data directly.
    //
    // Private and limited-visibility profiles are deliberately indistinguishable
    // from missing profiles at this public read boundary.
    // -------------------------------------------------------------------------

    if (!aggregate.isPublic()) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 6. Resolve the optional avatar reference
    // -------------------------------------------------------------------------
    //
    // AvatarAssetPublicId is optional in the Traveller Profile aggregate.
    //
    // Although aggregate.hasAvatar() expresses the domain condition, it is
    // intentionally not used as a TypeScript narrowing mechanism because its
    // return type is boolean rather than a type predicate.
    //
    // Capturing the optional value once gives TypeScript a concrete value that
    // can be safely narrowed before its public identifier is accessed.
    // -------------------------------------------------------------------------

    const avatarAssetPublicId = aggregate.avatarAssetPublicId;

    // -------------------------------------------------------------------------
    // 7. Build the reduced public representation
    // -------------------------------------------------------------------------
    //
    // Only public Traveller information crosses this application boundary.
    //
    // Deliberately excluded:
    //
    // - memberPublicId;
    // - status;
    // - visibility;
    // - journey statistics;
    // - preferences;
    // - corridors;
    // - internal persistence ID;
    // - lifecycle timestamps;
    // - any other aggregate internals.
    //
    // The Social aggregate owns only the AvatarAssetPublicId reference.
    // Therefore this response exposes the public asset identifier only.
    //
    // URL/alt resolution must use the existing Assets application boundary
    // when that richer public asset contract is required. No new asset
    // resolution mechanism is introduced here.
    // -------------------------------------------------------------------------

    return {
      publicId: aggregate.profile.publicId.value,

      handle: aggregate.handle.value,

      bio: aggregate.bio.value,

      avatar:
        avatarAssetPublicId === undefined
          ? null
          : {
              publicId: avatarAssetPublicId.value,
            },

      countryCode: aggregate.countryCode.value,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetPublicTravellerByMemberQueryHandler;
