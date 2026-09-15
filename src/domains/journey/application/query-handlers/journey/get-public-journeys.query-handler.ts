// -----------------------------------------------------------------------------
// sisiMove — Get Public Journeys Query Handler
// -----------------------------------------------------------------------------
//
// This handler is the application-layer composition boundary for public
// Journey discovery.
//
// Responsibilities:
// - retrieve publicly discoverable Journeys from the Journey repository;
// - project Journey domain state into the public marketplace representation;
// - enrich the Journey with public Traveller and Trust information.
//
// It deliberately does NOT:
// - expose JourneyEntity directly;
// - expose providerPublicId;
// - expose internal entity identifiers;
// - expose internal lifecycle timestamps;
// - create or own a Provider aggregate;
// - fetch Traveller/Trust inside the Journey repository;
// - make the Journey domain depend on Social or Trust.
//
// Journey remains the owner of Journey creation and Journey lifecycle.
// Traveller and Trust remain separate bounded contexts.
// The application query handler composes their public read models.
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
import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Journey Application
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';
import {
  PublicJourneyMapper,
  type PublicJourneyProjection,
} from '../../mappers/public-journey.mapper';

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
 * Notice that this type intentionally does NOT contain:
 *
 *   journey: JourneyEntity
 *
 * The domain entity must never be serialized as the public API contract.
 *
 * The public contract is deliberately flat so that the frontend consumes the
 * marketplace object directly:
 *
 *   provider
 *   route
 *   schedule
 *   vehicle
 *   capacity
 *   pricing
 *   preferences
 *   assets
 */
export interface PublicJourneyResponse extends PublicJourneyProjection {
  readonly provider: PublicJourneyProvider;
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
   * Resolve either:
   *
   *   GET public collection
   *
   * or:
   *
   *   GET public Journey by publicId
   *
   * through the same plural query.
   *
   * An individual Journey is represented as a one-item collection internally
   * so that the public query architecture remains plural and consistent.
   */
  private async findPublicJourneys(
    query: GetPublicJourneysQuery,
  ): Promise<readonly JourneyEntity[]> {
    if (query.publicId !== undefined) {
      const journey = await this.repository.findPublicJourneyByPublicId(
        new JourneyPublicId(query.publicId),
      );

      return journey === null ? [] : [journey];
    }

    const filters: {
      readonly from?: string;
      readonly to?: string;
      readonly date?: string;
    } = {
      ...(query.from !== undefined ? { from: query.from } : {}),
      ...(query.to !== undefined ? { to: query.to } : {}),
      ...(query.date !== undefined ? { date: query.date } : {}),
    };

    return this.repository.findPublicJourneys(filters);
  }

  // ===========================================================================
  // Public Composition
  // ===========================================================================

  /**
   * Compose the complete public marketplace representation.
   *
   * Journey owns the Journey data.
   * Traveller owns the public traveller profile.
   * Trust owns the public trust profile.
   *
   * The application layer is the correct place to compose those independent
   * read models into the public Journey marketplace object.
   */
  private async composePublicJourney(
    journey: JourneyEntity,
  ): Promise<PublicJourneyResponse> {
    const providerPublicId = journey.providerPublicId.value;

    const memberPublicId = new MemberPublicId(providerPublicId);

    const [traveller, trust] = await Promise.all([
      this.getPublicTravellerByMemberHandler.execute(
        new GetPublicTravellerByMemberQuery(memberPublicId),
      ),

      this.getPublicTrustProfileByMemberHandler.execute(
        new GetPublicTrustProfileByMemberQuery(memberPublicId.value),
      ),
    ]);

    const publicJourney = PublicJourneyMapper.fromEntity(journey);

    return {
      ...publicJourney,

      provider: {
        traveller,
        trust,
      },
    };
  }
}
