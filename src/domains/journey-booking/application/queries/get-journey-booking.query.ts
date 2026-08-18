// -----------------------------------------------------------------------------
// Journey Booking — Get Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves a Journey Booking aggregate by its public identifier.
 *
 * The query operates on the Journey Booking public identity and does not
 * expose persistence concerns.
 */
export class GetJourneyBookingQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Booking to retrieve.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,
  ) {
    super();
  }
}
