// src/domains/journey-demand/application/handlers/get-journey-demand-schedule.handler.ts

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
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyDemandScheduleQueryHandler implements QueryHandler<
  GetJourneyDemandScheduleQuery,
  JourneyDemandScheduleEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

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
