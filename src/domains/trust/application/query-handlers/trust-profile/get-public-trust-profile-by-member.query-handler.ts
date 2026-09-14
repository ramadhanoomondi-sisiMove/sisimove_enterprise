// -----------------------------------------------------------------------------
// sisiMove — Get Public Trust Profile By Member Query Handler
// -----------------------------------------------------------------------------
//
// Public Trust read boundary.
//
// This application query handler composes the reduced Trust information that
// may be exposed through the public SisiMove marketplace.
//
// The handler is an application-level composer.
//
// It is NOT:
//
// - a domain service;
// - a REST controller;
// - a REST mapper;
// - an Asset storage service;
// - an Asset delivery service.
//
// Responsibilities:
//
// - load the Trust profile for a member;
// - select information permitted in the public Trust representation;
// - select active ProfileBadge assignments;
// - select active Badge definitions;
// - resolve optional badge artwork through Asset's public-reference query;
// - return the application-level public Trust result.
//
// The handler deliberately does not:
//
// - invoke REST mappers;
// - construct HTTP responses;
// - access Prisma;
// - access Asset storage;
// - access AssetDeliveryPort directly;
// - construct Asset URLs;
// - modify the Trust aggregate.
//
// REST mapping remains the responsibility of the controller.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Foundation
// =============================================================================

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// =============================================================================
// Application — Query
// =============================================================================

import type { GetPublicTrustProfileByMemberQuery } from '../../queries/trust-profile/get-public-trust-profile-by-member.query';

// =============================================================================
// Application — Asset Public Reference
// =============================================================================
//
// Trust consumes Asset through Asset's existing application-level
// public-reference capability.
//
// Trust does not know anything about:
//
// - storage providers;
// - buckets;
// - object keys;
// - filesystem infrastructure;
// - CDN infrastructure;
// - signed URLs;
// - AssetStoragePort;
// - AssetDeliveryPort.
//
// Asset remains responsible for determining whether an Asset is publicly
// usable and for resolving its consumer-facing URL.
//
// =============================================================================

import {
  GetPublicAssetReferenceQuery,
  type PublicAssetReference,
} from '../../../../assets/application/queries/get-public-asset-reference.query';

import { ASSET_TOKENS } from '../../../../assets/application/asset.tokens';

// =============================================================================
// Domain — Trust Member Public Identifier
// =============================================================================
//
// The Trust repository is a domain contract and therefore requires its
// MemberPublicId value object.
//
// The public query is allowed to receive the primitive public identifier at
// the application boundary, but it must be converted to the Trust domain value
// object before crossing into the repository.
//
// =============================================================================

import { MemberPublicId } from '../../../domain/value-objects/member-public-id.vo';

// =============================================================================
// Domain — Trust Repository
// =============================================================================

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Application — Public Result
// =============================================================================
//
// These interfaces describe the result of this specific application use case.
//
// They are NOT REST response DTOs.
//
// The controller remains responsible for converting this result into the
// presentation/HTTP response contract.
//
// =============================================================================

export interface PublicTrustBadgeAsset {
  /**
   * Public identifier of the Asset.
   */
  publicId: string;

  /**
   * Consumer-facing public Asset URL resolved by Asset.
   */
  url: string;

  /**
   * Accessible alternative text for the badge artwork.
   *
   * The semantic meaning of the artwork belongs to the Trust badge, therefore
   * Trust supplies this value.
   */
  alt: string;
}

export interface PublicTrustBadge {
  /**
   * Public identifier of the Trust badge.
   */
  publicId: string;

  /**
   * Stable public badge type.
   */
  type: string;

  /**
   * Human-readable badge name.
   */
  name: string;

  /**
   * Optional public badge description.
   */
  description: string | null;

  /**
   * Optional publicly usable badge artwork.
   */
  asset: PublicTrustBadgeAsset | null;
}

export interface PublicTrustProfile {
  /**
   * Public Trust verification level.
   */
  verificationLevel: string;

  /**
   * Aggregate Trust rating.
   */
  ratingAverage: number;

  /**
   * Number of ratings contributing to the aggregate rating.
   */
  ratingCount: number;

  /**
   * Number of completed journeys represented by Trust.
   */
  completedJourneys: number;

  /**
   * Active public badges awarded to the traveller.
   */
  badges: PublicTrustBadge[];
}

// =============================================================================
// Handler
// =============================================================================

export class GetPublicTrustProfileByMemberQueryHandler implements QueryHandler<
  GetPublicTrustProfileByMemberQuery,
  PublicTrustProfile
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Trust Profile repository.
     *
     * The repository reconstructs the Trust Profile aggregate from persistence.
     */
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,

    /**
     * Asset public-reference query handler.
     *
     * Trust consumes Asset through the Asset application's public-reference
     * capability rather than accessing Asset infrastructure directly.
     */
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
    query: GetPublicTrustProfileByMemberQuery,
  ): Promise<PublicTrustProfile> {
    // -------------------------------------------------------------------------
    // Convert the application boundary primitive into Trust's domain value
    // object before invoking the domain repository.
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(query.memberPublicId);

    // -------------------------------------------------------------------------
    // Load Trust Profile aggregate
    // -------------------------------------------------------------------------
    //
    // The repository contract requires MemberPublicId rather than string.
    //
    // -------------------------------------------------------------------------

    const aggregate =
      await this.repository.findByMemberPublicId(memberPublicId);

    if (aggregate === null) {
      throw new Error('Public trust profile not found.');
    }

    // -------------------------------------------------------------------------
    // Build public badge list
    // -------------------------------------------------------------------------
    //
    // A badge is publicly exposed only when both:
    //
    // - the ProfileBadge assignment is active; and
    // - the Badge definition is active.
    //
    // -------------------------------------------------------------------------

    const badges: PublicTrustBadge[] = [];

    for (const profileBadge of aggregate.profileBadges) {
      // -----------------------------------------------------------------------
      // Ignore inactive badge assignments.
      // -----------------------------------------------------------------------

      if (!profileBadge.active) {
        continue;
      }

      // -----------------------------------------------------------------------
      // Resolve the Badge definition belonging to this ProfileBadge.
      // -----------------------------------------------------------------------
      //
      // profileBadge.badgeId is the Trust Badge public identifier.
      //
      // Trust owns both the ProfileBadge relationship and the Badge definition
      // within this reconstructed aggregate.
      //
      // -----------------------------------------------------------------------

      const badge = aggregate.badges.find(
        (candidate) => candidate.publicId.value === profileBadge.badgeId.value,
      );

      // -----------------------------------------------------------------------
      // Ignore missing or inactive badge definitions.
      // -----------------------------------------------------------------------

      if (badge === undefined || !badge.active) {
        continue;
      }

      // -----------------------------------------------------------------------
      // Resolve optional badge artwork.
      // -----------------------------------------------------------------------
      //
      // Trust stores only the opaque Asset public identifier.
      //
      // The Asset application capability expects that identifier as a string.
      // Therefore we intentionally pass badge.assetPublicId directly.
      //
      // We do NOT construct AssetPublicId here because:
      //
      // - GetPublicAssetReferenceQuery accepts string;
      // - the Asset query itself is responsible for crossing into Asset's
      //   domain/application boundary correctly.
      //
      // -----------------------------------------------------------------------

      let asset: PublicTrustBadgeAsset | null = null;

      const assetPublicId = badge.assetPublicId;

      if (assetPublicId !== undefined) {
        try {
          const publicAsset = await this.getPublicAssetReferenceHandler.execute(
            new GetPublicAssetReferenceQuery(assetPublicId),
          );

          asset = {
            publicId: publicAsset.publicId,
            url: publicAsset.url,
            alt: badge.name.value,
          };
        } catch {
          asset = null;
        }
      }

      // -----------------------------------------------------------------------
      // Add public badge.
      // -----------------------------------------------------------------------

      badges.push({
        publicId: badge.publicId.value,
        type: badge.type.value,
        name: badge.name.value,
        description: badge.description?.value ?? null,
        asset,
      });
    }

    // -------------------------------------------------------------------------
    // Return the public application result.
    // -------------------------------------------------------------------------
    //
    // The Trust aggregate itself never crosses the application boundary.
    //
    // Only information required by this public Trust use case is returned.
    //
    // REST mapping happens later in the controller.
    //
    // -------------------------------------------------------------------------

    return {
      verificationLevel: aggregate.profile.verificationLevel.value,
      ratingAverage: aggregate.profile.ratingAverage.value,
      ratingCount: aggregate.profile.ratingCount.value,
      completedJourneys: aggregate.profile.completedJourneys.value,
      badges,
    };
  }
}

export default GetPublicTrustProfileByMemberQueryHandler;
