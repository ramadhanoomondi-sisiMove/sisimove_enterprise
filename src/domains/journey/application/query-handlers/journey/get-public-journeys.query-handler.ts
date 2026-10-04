// src/domains/journey/application/query-handlers/public/get-public-journeys.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Public Journeys Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer composition boundary for public Journey marketplace
// discovery.
//
// Responsibilities:
// - retrieve publicly discoverable Journeys from the Journey repository;
// - project Journey domain state into the public marketplace representation;
// - enrich the Journey with public Traveller and Trust information;
// - resolve public Asset references;
// - pass supported marketplace discovery filters to the Journey repository.
//
// -----------------------------------------------------------------------------
// Public Visibility
// -----------------------------------------------------------------------------
//
// Public visibility is enforced exclusively by the Journey repository public
// read boundary:
//
//   findPublicJourneys()
//   findPublicJourneyByPublicId()
//
// A Journey is publicly discoverable only when BOTH conditions are satisfied:
//
//   1. its lifecycle status is marketplace-visible;
//   2. its scheduled departure time has not elapsed.
//
// Therefore:
//
//   marketplace-visible status
//   AND
//   departureAt > now
//   =
//   publicly discoverable
//
// The handler deliberately does NOT reproduce these visibility rules.
//
// In particular, the handler does not:
//
// - inspect Journey status;
// - compare departureAt with the current time;
// - filter CANCELLED Journeys;
// - filter EXPIRED Journeys;
// - filter departed PUBLISHED Journeys;
// - apply a second marketplace visibility predicate.
//
// The repository is the single public-read visibility boundary.
//
// This applies equally to:
//
//   GET /journeys/public
//   GET /journeys/search
//   GET /journeys/:journeyPublicId
//
// A Journey whose departure time has elapsed is therefore not returned from
// the public marketplace even if its persisted lifecycle status is still
// PUBLISHED.
//
// EXPIRED and CANCELLED Journeys are likewise never returned.
//
// Provider-owned Journey history is a separate read boundary and is not
// governed by this handler.
//
// -----------------------------------------------------------------------------
// Marketplace Filters
// -----------------------------------------------------------------------------
//
// Public Journey collection discovery supports:
//
//   - from
//   - to
//   - date
//   - minPrice
//   - maxPrice
//
// Price filters represent the Journey's OFFERED PRICE PER PASSENGER SEAT.
//
// Currency:
//
//   KES
//
// Price boundaries are inclusive:
//
//   minPrice <= pricePerSeat <= maxPrice
//
// The handler does not perform marketplace visibility filtering itself.
// It simply passes caller-supplied discovery constraints to the repository,
// which remains responsible for the public-read boundary.
//
// When a public Journey is requested directly by publicId, collection filters
// are intentionally ignored. Public detail remains governed only by the
// public Journey visibility boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetPublicJourneysQuery } from '../../queries/journey/get-public-journeys.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';
import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Journey Application
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

import {
  PublicJourneyMapper,
  type PublicJourneyProjection,
} from '../../mappers/public-journey.mapper';

// -----------------------------------------------------------------------------
// Asset
// -----------------------------------------------------------------------------

import { AssetPublicId } from '../../../../assets/domain/value-objects';

import {
  GetPublicAssetReferenceQuery,
  type PublicAssetReference,
} from '../../../../assets/application/queries/get-public-asset-reference.query';

import { ASSET_TOKENS } from '../../../../assets/application/asset.tokens';

// -----------------------------------------------------------------------------
// Social / Traveller Profile
// -----------------------------------------------------------------------------

import { GetPublicTravellerByMemberQuery } from '../../../../social/application/queries/get-public-traveller-by-member.query';

import type { PublicTravellerProfileResponse } from '../../../../social/application/query-handlers/get-public-traveller-by-member.query-handler';

import { TRAVELLER_PROFILE_TOKENS } from '../../../../social/application/traveller-profile.tokens';

import { MemberPublicId } from '../../../../social/domain/value-objects/member-public-id.vo';

// -----------------------------------------------------------------------------
// Trust
// -----------------------------------------------------------------------------

import { GetPublicTrustProfileByMemberQuery } from '../../../../trust/application/queries/trust-profile/get-public-trust-profile-by-member.query';

import type { PublicTrustProfile } from '../../../../trust/application/query-handlers/trust-profile/get-public-trust-profile-by-member.query-handler';

import { TRUST_PROFILE_TOKENS } from '../../../../trust/application/trust-profile.tokens';

// -----------------------------------------------------------------------------
// Public Provider
// -----------------------------------------------------------------------------

export interface PublicJourneyProvider {
  readonly traveller: PublicTravellerProfileResponse;
  readonly trust: PublicTrustProfile;
}

// -----------------------------------------------------------------------------
// Public Journey Response
// -----------------------------------------------------------------------------

/**
 * Canonical public Journey marketplace response.
 *
 * The public response is composed from independent bounded-context
 * read models. JourneyEntity itself is never exposed.
 */
export interface PublicJourneyResponse extends PublicJourneyProjection {
  readonly provider: PublicJourneyProvider;
}

// -----------------------------------------------------------------------------
// Public Journey Repository Filters
// -----------------------------------------------------------------------------

/**
 * Repository-facing public Journey discovery filters.
 *
 * These filters narrow an already-publicly-discoverable Journey collection.
 *
 * Price values represent the offered price per passenger seat in KES.
 */
interface PublicJourneyRepositoryFilters {
  readonly from?: string;
  readonly to?: string;
  readonly date?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetPublicJourneysQueryHandler implements QueryHandler<
  GetPublicJourneysQuery,
  readonly PublicJourneyResponse[]
> {
  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,

    @Inject(
      TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID,
    )
    private readonly getPublicTravellerByMemberHandler: QueryHandler<
      GetPublicTravellerByMemberQuery,
      PublicTravellerProfileResponse
    >,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID)
    private readonly getPublicTrustProfileByMemberHandler: QueryHandler<
      GetPublicTrustProfileByMemberQuery,
      PublicTrustProfile
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_REFERENCE)
    private readonly getPublicAssetReferenceHandler: QueryHandler<
      GetPublicAssetReferenceQuery,
      PublicAssetReference
    >,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetPublicJourneysQuery,
  ): Promise<readonly PublicJourneyResponse[]> {
    const journeys = await this.findPublicJourneys(query);

    if (journeys.length === 0) {
      return [];
    }

    return Promise.all(
      journeys.map((journey) => this.composePublicJourney(journey)),
    );
  }

  // ===========================================================================
  // Journey Retrieval
  // ===========================================================================

  /**
   * Retrieve only Journeys that are currently eligible for public marketplace
   * discovery.
   *
   * Collection and detail deliberately use the same repository-level public
   * visibility boundary.
   *
   * Therefore:
   *
   *   GET /journeys/public
   *   GET /journeys/search
   *   GET /journeys/:journeyPublicId
   *
   * cannot accidentally apply different public visibility rules.
   *
   * The repository is responsible for enforcing BOTH public visibility
   * conditions:
   *
   *   1. marketplace-visible lifecycle status;
   *   2. departureAt > now.
   *
   * Consequently, the repository excludes:
   *
   *   - DRAFT
   *   - COMPLETED
   *   - CANCELLED
   *   - EXPIRED
   *   - marketplace-visible Journeys whose departure time has elapsed
   *
   * The handler intentionally performs none of these checks itself.
   */
  private async findPublicJourneys(
    query: GetPublicJourneysQuery,
  ): Promise<readonly JourneyEntity[]> {
    // -------------------------------------------------------------------------
    // Public Journey Detail
    // -------------------------------------------------------------------------

    if (query.publicId !== undefined) {
      const journey = await this.repository.findPublicJourneyByPublicId(
        new JourneyPublicId(query.publicId),
      );

      return journey === null ? [] : [journey];
    }

    // -------------------------------------------------------------------------
    // Public Journey Collection
    // -------------------------------------------------------------------------

    const filters: PublicJourneyRepositoryFilters = {
      ...(query.from !== undefined ? { from: query.from } : {}),
      ...(query.to !== undefined ? { to: query.to } : {}),
      ...(query.date !== undefined ? { date: query.date } : {}),
      ...(query.minPrice !== undefined ? { minPrice: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { maxPrice: query.maxPrice } : {}),
    };

    return this.repository.findPublicJourneys(filters);
  }

  // ===========================================================================
  // Public Composition
  // ===========================================================================

  /**
   * Compose the complete public marketplace representation.
   *
   * Journey owns Journey data.
   * Traveller owns the public Traveller profile.
   * Trust owns the public Trust profile.
   * Asset owns public Asset visibility and delivery.
   *
   * The application layer composes those independent read models into the
   * public Journey marketplace representation.
   */
  private async composePublicJourney(
    journey: JourneyEntity,
  ): Promise<PublicJourneyResponse> {
    const providerPublicId = journey.providerPublicId.value;

    const memberPublicId = new MemberPublicId(providerPublicId);

    const publicJourney = PublicJourneyMapper.fromEntity(journey);

    const [traveller, trust, vehicleAsset] = await Promise.all([
      // -----------------------------------------------------------------------
      // Traveller
      // -----------------------------------------------------------------------

      this.getPublicTravellerByMemberHandler.execute(
        new GetPublicTravellerByMemberQuery(memberPublicId),
      ),

      // -----------------------------------------------------------------------
      // Trust
      // -----------------------------------------------------------------------

      this.getPublicTrustProfileByMemberHandler.execute(
        new GetPublicTrustProfileByMemberQuery(memberPublicId.value),
      ),

      // -----------------------------------------------------------------------
      // Vehicle Asset
      // -----------------------------------------------------------------------

      this.resolveVehicleAsset(publicJourney.vehicle.assetPublicId),
    ]);

    return {
      ...publicJourney,

      // -----------------------------------------------------------------------
      // Vehicle
      // -----------------------------------------------------------------------

      vehicle: {
        ...publicJourney.vehicle,
        asset: vehicleAsset,
      },

      // -----------------------------------------------------------------------
      // Provider
      // -----------------------------------------------------------------------

      provider: {
        traveller,
        trust,
      },
    };
  }

  // ===========================================================================
  // Vehicle Asset Composition
  // ===========================================================================

  /**
   * Resolve the vehicle's opaque Asset public identifier through the Asset
   * bounded context.
   *
   * Journey never constructs the Asset URL and never accesses Asset
   * persistence or physical storage directly.
   *
   * A Journey without a vehicle Asset remains valid and receives:
   *
   *   asset: null
   *
   * A referenced Asset that cannot be publicly resolved is allowed to
   * propagate the Asset application's public-reference exception rather than
   * silently returning an invalid public Asset reference.
   */
  private async resolveVehicleAsset(
    assetPublicId: string | null,
  ): Promise<PublicAssetReference | null> {
    if (assetPublicId === null) {
      return null;
    }

    return this.getPublicAssetReferenceHandler.execute(
      new GetPublicAssetReferenceQuery(new AssetPublicId(assetPublicId)),
    );
  }
}
