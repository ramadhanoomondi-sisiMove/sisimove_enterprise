// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand By Public ID Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving a Journey Demand aggregate
// by its public identifier.
//
// Responsibilities:
// - receive the public identifier through the application query;
// - delegate the read operation to the JourneyDemandRepository application
//   port;
// - translate a missing aggregate into the domain-level not-found exception;
// - return the JourneyDemandAggregate.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - perform authentication;
// - perform authorization;
// - instantiate a repository;
// - expose Prisma models.
//
// Dependency injection is resolved through Journey Demand application tokens.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandByPublicIdQuery } from '../queries/get-journey-demand-by-public-id.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Journey Demand Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyDemandByPublicIdQueryHandler implements QueryHandler<
  GetJourneyDemandByPublicIdQuery,
  JourneyDemandAggregate
> {
  public constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandByPublicIdQuery,
  ): Promise<JourneyDemandAggregate> {
    const aggregate = await this.repository.findByPublicId(
      query.journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    return aggregate;
  }
}
