// src/domains/journey-demand/application/queries/find-journey-demands-by-schedule.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandScheduleId } from '../../domain/value-objects/journey-demand-schedule-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for finding Journey Demands associated with a Journey Demand schedule.
 *
 * Aligned with:
 *
 * JourneyDemandRepository.findScheduleById(
 *   journeyDemandId: JourneyDemandId,
 *   scheduleId: JourneyDemandScheduleId,
 * )
 *
 * and the aggregate-owned schedule model.
 *
 * Note:
 * A JourneyDemandSchedule is a 1:1 child of JourneyDemand, so infrastructure
 * may resolve the owning JourneyDemand through the schedule identifier.
 */
export class FindJourneyDemandsByScheduleQuery extends Query {
  constructor(
    /**
     * Internal identifier of the Journey Demand schedule.
     */
    public readonly scheduleId: JourneyDemandScheduleId,

    /**
     * Optional maximum number of Journey Demands to return.
     */
    public readonly limit?: number,

    /**
     * Optional number of Journey Demands to skip.
     */
    public readonly offset?: number,
  ) {
    super();
  }
}
