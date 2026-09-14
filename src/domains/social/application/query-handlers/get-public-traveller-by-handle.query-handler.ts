// -----------------------------------------------------------------------------
// Social — Get Public Traveller By Handle Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the public Traveller Profile
// representation by public Traveller handle.
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
// - validate and normalize the Traveller handle;
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
// This handler is intentionally separate from
// GetTravellerProfileByHandleQueryHandler.
//
// The existing handle query serves the broader Traveller Profile read
// contract. This query exists specifically for the anonymous/public
// Traveller Profile boundary and therefore returns only information that is
// explicitly safe for public discovery.
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

import type { GetPublicTravellerByHandleQuery } from '../queries/get-public-traveller-by-handle.query';

// -----------------------------------------------------------------------------
// Existing Public Response Contract
// -----------------------------------------------------------------------------
//
// The public Traveller Profile response contract is already defined by the
// public-member query handler.
//
// Both public lookup mechanisms:
//
// - by Member public ID;
// - by Traveller handle;
//
// return the same reduced public Traveller Profile representation.
//
// Do not declare another PublicTravellerProfileResponse interface here.
// -----------------------------------------------------------------------------

import type { PublicTravellerProfileResponse } from './get-public-traveller-by-member.query-handler';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { TravellerHandle } from '../../domain/value-objects/traveller-handle.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { TravellerProfilePublicNotFoundException } from '../../domain/exceptions/traveller-profile-public-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a publicly visible Traveller Profile by public handle.
 *
 * The repository resolves the complete TravellerProfileAggregate.
 *
 * The handler then:
 *
 * 1. verifies that the query exists;
 * 2. validates and normalizes the supplied handle;
 * 3. resolves the aggregate by TravellerHandle;
 * 4. verifies that the aggregate exists;
 * 5. verifies that the aggregate is publicly visible;
 * 6. deliberately reduces the aggregate into the public Traveller contract.
 *
 * A missing, invalid, private, or limited-visibility Traveller Profile is
 * represented by the same public exception so that this endpoint does not
 * disclose whether a non-public Traveller Profile exists.
 */
@Injectable()
export class GetPublicTravellerByHandleQueryHandler implements QueryHandler<
  GetPublicTravellerByHandleQuery,
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
   * A Traveller Profile that does not exist, has an invalid handle, or is not
   * publicly visible is treated as unavailable through this public read
   * boundary.
   */
  public async execute(
    query: GetPublicTravellerByHandleQuery,
  ): Promise<PublicTravellerProfileResponse> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 2. Handle guard
    // -------------------------------------------------------------------------

    if (query.handle === undefined || query.handle.trim().length === 0) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 3. Validate and normalize the handle
    // -------------------------------------------------------------------------
    //
    // TravellerHandle owns:
    //
    // - trimming;
    // - lowercase normalization;
    // - minimum length validation;
    // - maximum length validation;
    // - allowed-character validation.
    //
    // Invalid handles are deliberately indistinguishable from unavailable
    // public profiles at this anonymous/public boundary.
    // -------------------------------------------------------------------------

    let handle: TravellerHandle;

    try {
      handle = new TravellerHandle(query.handle);
    } catch {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 4. Resolve the Traveller Profile aggregate
    // -------------------------------------------------------------------------
    //
    // Aggregate reconstruction belongs to the repository.
    //
    // The handler deliberately does not access Prisma or reconstruct any
    // aggregate entities itself.
    // -------------------------------------------------------------------------

    const aggregate =
      await this.travellerProfileRepository.findByHandle(handle);

    // -------------------------------------------------------------------------
    // 5. Ensure the aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 6. Enforce the public visibility boundary
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the visibility rule.
    //
    // Private and limited-visibility profiles are deliberately indistinguishable
    // from missing profiles at this public read boundary.
    // -------------------------------------------------------------------------

    if (!aggregate.isPublic()) {
      throw new TravellerProfilePublicNotFoundException();
    }

    // -------------------------------------------------------------------------
    // 7. Resolve the optional avatar reference
    // -------------------------------------------------------------------------
    //
    // The Traveller Profile aggregate owns only the Asset public identifier.
    //
    // URL and presentation metadata are not resolved here.
    // -------------------------------------------------------------------------

    const avatarAssetPublicId = aggregate.avatarAssetPublicId;

    // -------------------------------------------------------------------------
    // 8. Build the reduced public representation
    // -------------------------------------------------------------------------
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

export default GetPublicTravellerByHandleQueryHandler;
