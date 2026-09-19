// src/domains/journey-demand/application/handlers/get-journey-demand-corridor.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Corridor Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving the Corridor component of a
// specific Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve its Corridor component;
// - translate missing Journey Demand or Corridor into the appropriate
//   domain-level not-found exception;
// - return the JourneyDemandCorridorEntity.
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

import type { GetJourneyDemandCorridorQuery } from '../queries/get-journey-demand-corridor.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridorEntity } from '../../domain/entities/journey-demand-corridor.entity';
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
export class GetJourneyDemandCorridorQueryHandler implements QueryHandler<
  GetJourneyDemandCorridorQuery,
  JourneyDemandCorridorEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandCorridorQuery,
  ): Promise<JourneyDemandCorridorEntity> {
    // -------------------------------------------------------------------------
    // Load Journey Demand Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Validate Journey Demand
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Load Corridor
    //
    // JourneyDemandAggregate exposes the aggregate's internal identity through
    // aggregateId. There is intentionally no journeyDemandId property on the
    // aggregate.
    // -------------------------------------------------------------------------

    const corridor = await this.repository.findCorridor(aggregate.aggregateId);

    // -------------------------------------------------------------------------
    // Validate Corridor
    // -------------------------------------------------------------------------

    if (corridor === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return corridor;
  }
}
