// src/domains/journey/application/query-handlers/journey/get-journey-schedule.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyScheduleQuery } from '../../queries/journey/get-journey-schedule.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyScheduleEntity } from '../../../domain/entities/journey-schedule.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyScheduleQueryHandler implements QueryHandler<
  GetJourneyScheduleQuery,
  JourneyScheduleEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyScheduleQuery,
  ): Promise<JourneyScheduleEntity | null> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Schedule
    //
    // Schedule is owned by the Journey aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findSchedule(aggregate.journeyId);
  }
}
