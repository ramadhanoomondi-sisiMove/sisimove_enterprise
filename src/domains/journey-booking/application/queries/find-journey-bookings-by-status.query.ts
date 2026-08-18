// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Status Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingStatus } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves Journey Bookings matching a specified lifecycle status.
 *
 * The status is represented by the JourneyBookingStatus domain value object.
 *
 * This query performs collection retrieval and does not rehydrate aggregate
 * roots.
 */
export class FindJourneyBookingsByStatusQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Journey Booking lifecycle status used to filter the results.
     */
    public readonly status: JourneyBookingStatus,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByStatusQuery;
