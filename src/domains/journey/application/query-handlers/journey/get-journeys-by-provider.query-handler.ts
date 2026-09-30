// -----------------------------------------------------------------------------
// sisiMove — Get Journeys By Provider Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving complete Journey aggregates
// belonging to a specific provider.
//
// This query is used by authenticated provider-facing Journey surfaces such as
//:
//
//     GET /journeys/me
//
// Because the presentation layer maps the result through MyJourneyMapper,
// this handler deliberately retrieves complete Journey aggregates rather than
// root Journey entities.
//
// Responsibilities:
// - convert the primitive provider public ID into the Journey domain value
//   object;
// - delegate aggregate retrieval to JourneyRepository;
// - return complete JourneyAggregate instances.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - perform authentication;
// - perform authorization;
// - resolve the current authenticated identity;
// - instantiate a repository;
// - expose Prisma models.
//
// The presentation layer determines the provider identity from the
// authenticated JWT and passes that identity into the application query.
//
// Repository operation:
// - findByProviderPublicId() returns complete Journey aggregates.
// - findJourneysByProvider() returns only JourneyEntity instances and is
//   therefore intentionally not used here.
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

import type { GetJourneysByProviderQuery } from '../../queries/journey/get-journeys-by-provider.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyProviderPublicId } from '../../../domain/value-objects/journey-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Journey Application
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneysByProviderQueryHandler implements QueryHandler<
  GetJourneysByProviderQuery,
  JourneyAggregate[]
> {
  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneysByProviderQuery,
  ): Promise<JourneyAggregate[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    return this.repository.findByProviderPublicId(providerPublicId);
  }
}