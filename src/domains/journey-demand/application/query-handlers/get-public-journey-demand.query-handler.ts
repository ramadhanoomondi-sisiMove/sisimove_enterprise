// src/domains/journey-demand/application/query-handlers/public/get-public-journey-demand.query-handler.ts

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation Application Contracts
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application Query
// -----------------------------------------------------------------------------

import type { GetPublicJourneyDemandQuery } from '../queries/get-public-journey-demand.query';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// =============================================================================
// Get Public Journey Demand Query Handler
// =============================================================================
//
// Application handler for the public Journey Demand read boundary.
//
// The handler deliberately contains no public-visibility rules itself.
//
// Public visibility belongs to the Journey Demand repository contract:
//
//   findPublicJourneyDemandByPublicId(...)
//
// This keeps the application layer independent of Prisma/persistence details
// while ensuring that an existing but non-public Journey Demand is not exposed
// through the public read path.
//
// The handler also does not compose:
//
// - Traveller Profile;
// - Trust;
// - Assets;
// - Journey;
// - Marketplace.
//
// Those concerns belong to their respective read/composition boundaries.
//
// =============================================================================

@Injectable()
export class GetPublicJourneyDemandQueryHandler implements QueryHandler<
  GetPublicJourneyDemandQuery,
  JourneyDemandAggregate | null
> {
  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    query: GetPublicJourneyDemandQuery,
  ): Promise<JourneyDemandAggregate | null> {
    return this.repository.findPublicJourneyDemandByPublicId(
      query.journeyDemandPublicId,
    );
  }
}
