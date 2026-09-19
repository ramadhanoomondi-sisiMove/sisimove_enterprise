// src/domains/journey-demand/application/handlers/get-journey-demand-waypoints.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Waypoints Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving all Waypoints belonging to
// a specific Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve its Waypoints;
// - translate a missing Journey Demand into the appropriate domain-level
//   not-found exception;
// - return the JourneyDemandWaypointEntity collection.
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

import type { GetJourneyDemandWaypointsQuery } from '../queries/get-journey-demand-waypoints.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointEntity } from '../../domain/entities/journey-demand-waypoint.entity';
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
export class GetJourneyDemandWaypointsQueryHandler implements QueryHandler<
  GetJourneyDemandWaypointsQuery,
  JourneyDemandWaypointEntity[]
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
    query: GetJourneyDemandWaypointsQuery,
  ): Promise<JourneyDemandWaypointEntity[]> {
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
    // Load Waypoints
    //
    // JourneyDemandAggregate exposes its internal identity through aggregateId.
    // There is intentionally no journeyDemandId property on the aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findWaypoints(aggregate.aggregateId);
  }
}
