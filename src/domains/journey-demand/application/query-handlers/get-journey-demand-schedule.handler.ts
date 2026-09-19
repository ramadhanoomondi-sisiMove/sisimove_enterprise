// src/domains/journey-demand/application/handlers/get-journey-demand-schedule.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Schedule Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving the Schedule component of a
// specific Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve its Schedule component;
// - translate missing Journey Demand or Schedule into the appropriate
//   domain-level not-found exception;
// - return the JourneyDemandScheduleEntity.
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

import type { GetJourneyDemandScheduleQuery } from '../queries/get-journey-demand-schedule.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandScheduleEntity } from '../../domain/entities/journey-demand-schedule.entity';
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
export class GetJourneyDemandScheduleQueryHandler implements QueryHandler<
  GetJourneyDemandScheduleQuery,
  JourneyDemandScheduleEntity
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
    query: GetJourneyDemandScheduleQuery,
  ): Promise<JourneyDemandScheduleEntity> {
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
    // Load Schedule
    //
    // JourneyDemandAggregate exposes its internal identity through aggregateId.
    // There is intentionally no journeyDemandId property on the aggregate.
    // -------------------------------------------------------------------------

    const schedule = await this.repository.findSchedule(aggregate.aggregateId);

    // -------------------------------------------------------------------------
    // Validate Schedule
    // -------------------------------------------------------------------------

    if (schedule === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return schedule;
  }
}
